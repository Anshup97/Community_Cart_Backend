package com.communitycart.orderservice.service;

import com.communitycart.orderservice.client.EmailClient;
import com.communitycart.orderservice.client.ProductClient;
import com.communitycart.orderservice.dtos.*;
import com.communitycart.orderservice.entity.*;
import com.communitycart.orderservice.repository.CustomerRepository;
import com.communitycart.orderservice.repository.OrderRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Manages order placing, order updates etc.
 */
@Service
public class OrderService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductClient productClient;

    @Autowired
    private EmailClient emailClient;

    @Value("${STRIPE_URL}")
    private String url;

    @Value("${STRIPE_SECRET_KEY}")
    private String secret;

    //ModelMapper to map Order object to OrderDTO object.
    public ModelMapper mapper(){ return new ModelMapper(); }

    public EmailDTO emailDTOMapper(Order order) {
        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setCustomerId(order.getCustomerId());
        emailDTO.setOrderId(order.getOrderId());
        emailDTO.setTotalPrice(order.getTotalPrice());
        emailDTO.setOrderStatus(order.getStatus());
        emailDTO.setDeliveryDate(order.getDeliveryDate());
        emailDTO.setNoOfItems(order.getItems().size());
        Customer cust = customerRepository.findByCustomerId(order.getCustomerId());
        emailDTO.setCustomerEmail(cust.getEmail());
        emailDTO.setCustomerName(cust.getName());
        SellerDTO sellerDTO = productClient.getSeller(order.getSellerId()).get(0);
        emailDTO.setSellerEmail(sellerDTO.getEmail());
        emailDTO.setSellerName(sellerDTO.getName());
        emailDTO.setStatus(order.getStatus());
        return emailDTO;
    }

    public void further() {

    }

    //Custom entity to dto mapping method.
    public OrderDTO customMap(Order order){
        OrderDTO dto = new OrderDTO();
        Customer customer = customerRepository.findByCustomerId(order.getCustomerId());
        dto.setOrderId(order.getOrderId());
        dto.setCustomerId(order.getCustomerId());
        dto.setSellerId(order.getSellerId());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setShippingCharges(order.getShippingCharges());
        dto.setPaid(order.isPaid());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setDeliveryDate(order.getDeliveryDate());
        dto.setDeliveredAt(order.getDeliveredAt());
        dto.setStatus(order.getStatus());
        List<OrderItemDTO> items = new ArrayList<>();
        List<Long> productsIds = order.getItems().stream()
                        .map(OrderItem::getProductId)
                                .toList();
        List<ProductDTO> prods = productClient.getProductListById(productsIds);
        for(OrderItem orderItem: order.getItems()) {
            OrderItemDTO dto1 = new ModelMapper().map(orderItem, OrderItemDTO.class);
            ProductDTO pr = prods.stream()
                    .filter(p -> p.getProductId().equals(orderItem.getProductId()))
                    .findFirst().get();
            dto1.setProduct(pr);
            items.add(dto1);
        }
        dto.setItems(items);
        dto.setShippingAddress(mapper().map(customer.getAddress(), AddressDTO.class));
        if(!order.getPaymentMethod().equalsIgnoreCase("COD")){
            dto.setSessionId(order.getSessionId());
        }
        return dto;
    }

    /**
     * Place order places an order and return the order details.
     * Saves order details in the database.
     * Triggers order confirmation email to the customer.
     * @param customerId
     * @param paymentMethod
     * @param sessionId
     * @return
     */
    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }
    public OrderDTO placeOrder(Long customerId, String paymentMethod, String sessionId) {
        Customer customer = customerRepository.findByCustomerId(customerId);
        if(customer == null){
            return null;
        }
        Cart cart = customer.getCart();
        List<CartItem> items = cart.getItems();
        if(items==null || items.isEmpty()){
            return null;
        }
        Map<Long, List<CartItem>> orderMap = new HashMap<>();
        for(CartItem cartItem: items){
            Long sellerId = productClient.getProductById(cartItem.getProductId()).getSellerId();
            if(!orderMap.containsKey(sellerId)){
                List<CartItem> cartItems = new ArrayList<>();
                cartItems.add(cartItem);
                orderMap.put(sellerId, cartItems);
            } else {
                List<CartItem> cartItems = orderMap.get(sellerId);
                cartItems.add(cartItem);
                orderMap.put(sellerId, cartItems);
            }
        }
        for(Map.Entry<Long, List<CartItem>> en: orderMap.entrySet()){
            Long sellerId = en.getKey();
            List<CartItem> cartItems = en.getValue();
            List<OrderItem> orderItems = new ArrayList<>();
            double totalPrice = 0D;
            for(CartItem item: cartItems){
                Product p = productClient.getProductById(item.getProductId());
                if(item.getQuantity() > p.getProductQuantity()){
                    return null;
                }
                OrderItem orderItem = new OrderItem();
                orderItem.setProductId(item.getProductId());
                orderItem.setQuantity(item.getQuantity());
                orderItem.setItemPrice(p.getProductPrice());
                double tot = orderItem.getItemPrice() * item.getQuantity();
                totalPrice += tot;
                orderItem.setTotalPrice(tot);
                orderItems.add(orderItem);
                productClient.updateProductQuantity(p.getProductId(),
                        p.getProductQuantity()-item.getQuantity());
            }
            Order order = new Order();
            order.setCustomerId(customerId);
            order.setSellerId(sellerId);
            order.setPaymentMethod(paymentMethod);
            order.setTotalPrice(totalPrice);
            if(paymentMethod.equalsIgnoreCase("COD")){
                order.setShippingCharges(10D);
                order.setPaid(false);
            } else {
                order.setShippingCharges(5D);
                order.setPaid(true);
                order.setSessionId(sessionId);
            }
            order.setCreatedAt(new Date());
            order.setStatus("Placed");
            order.setItems(orderItems);
//            order.setShippingAddress(customer.getAddress());
            order.setAddressId(customer.getAddress().getAddressId());
            Order savedOrder = saveOrder(order);
            cartService.deleteFromCart(customerId, null);
            emailClient.sendHtmlEmail(emailDTOMapper(savedOrder));
            return customMap(savedOrder);
        }

        return null;
    }

    /**
     * Get list of orders for both seller or customer.
     * @param customerId
     * @param sellerId
     * @return
     */
    public List<OrderDTO> getOrders(Long customerId, Long sellerId){
        List<OrderDTO> orderDTOS = new ArrayList<>();
        if(sellerId == null){
            List<Order> orders = orderRepository.findByCustomerId(customerId);
            for(Order o: orders){
                orderDTOS.add(customMap(o));
            }
        } else {
            List<Order> orders = orderRepository.findBySellerId(sellerId);
            for(Order o: orders){
                orderDTOS.add(customMap(o));
            }

        }
        return orderDTOS;
    }

    //Get order by Id.
    public OrderDTO getOrderById(Long orderId){
        Order order = orderRepository.findByOrderId(orderId);
        if(order == null){
            return null;
        }
        return customMap(order);
    }

    /**
     * Create stripe session for payment.
     * Add product details for checkout.
     * Add total price of the order items.
     * @param customerId
     * @return
     * @throws StripeException
     */
    public Session createSession(Long customerId) throws StripeException {
        String successUrl = url + "payment/success";
        String failedUrl = url + "payment/failed";

        Stripe.apiKey = secret;
        List<SessionCreateParams.LineItem> sessionItemsList = new ArrayList<>();
        Customer customer = customerRepository.findByCustomerId(customerId);
        if(customer == null){
            return null;
        }
        Cart cart = customer.getCart();
        List<CartItem> cartItems = cart.getItems();
        if(cartItems==null || cartItems.isEmpty()){
            return null;
        }
        for(CartItem ci: cartItems){
            sessionItemsList.add(createSessionLineItem(ci));
        }
        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setCancelUrl(failedUrl)
                .setSuccessUrl(successUrl)
                .addAllLineItem(sessionItemsList)
                .build();
        return Session.create(params);
    }

    /**
     * Add product details as Stripe Lineitems so that it can be
     * displayed in the payment page.
     * @param ci
     * @return
     */
    private SessionCreateParams.LineItem createSessionLineItem(CartItem ci) {
        return SessionCreateParams.LineItem.builder()
                .setQuantity(ci.getQuantity())
                .setPriceData(createPriceData(ci))
                .build();
    }

    /**
     * Add product price details as Stripe Lineitems so that it can be
     * displayed in the payment page.
     * @param ci
     * @return
     */
    private SessionCreateParams.LineItem.PriceData createPriceData(CartItem ci) {
        Product p = productClient.getProductById(ci.getProductId());
        double price = p.getProductPrice();
        return SessionCreateParams.LineItem.PriceData.builder()
                .setCurrency("inr")
                .setUnitAmount((long)price * 100)
                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                        .setName(p.getProductName())
                        .setDescription(p.getProductDescription())
                        .build())
                .build();
    }

    /**
     * Update order for the seller to update order details such as
     * order delivery date, order status, delivered order payment status
     * and triggeres appropriate mails to the customer.
     * @param updateOrderBySeller
     * @return
     */
    public OrderDTO updateOrder(UpdateOrderBySeller updateOrderBySeller) {
        Order order = orderRepository.findByOrderId(updateOrderBySeller.getOrderId());
        if(order == null){
            return null;
        }
        if(!order.getStatus().equalsIgnoreCase("Delivered")){
            if(updateOrderBySeller.getDeliveryDate() != null){
                if(order.getDeliveryDate() == null){
                    String date = updateOrderBySeller.getDeliveryDate()
                            .toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate()
                            .toString();
                    emailClient.sendUpdateDeliveryDate(emailDTOMapper(order), date);
                }
                order.setDeliveryDate(updateOrderBySeller.getDeliveryDate());
            }
            if(updateOrderBySeller.getDeliveredAt() != null){
                if(updateOrderBySeller.getDeliveredAt() != order.getDeliveredAt()){
                    String date = updateOrderBySeller.getDeliveredAt()
                            .toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate()
                            .toString();
                    emailClient.sendDeliveredStatus(emailDTOMapper(order), "Delivered");
                }
                order.setDeliveredAt(updateOrderBySeller.getDeliveredAt());
                order.setStatus("Delivered");
            }
            if(updateOrderBySeller.getStatus() != null){
                if(!order.getStatus().equalsIgnoreCase(updateOrderBySeller.getStatus())){
                    if(!order.getStatus().equalsIgnoreCase("Delivered")){
                        order.setStatus(updateOrderBySeller.getStatus());
                        emailClient.sendDeliveryStatus(emailDTOMapper(order), updateOrderBySeller.getStatus());
                    }
                }
            }
            if(updateOrderBySeller.isPaid() && order.getPaymentMethod().equalsIgnoreCase("COD")){
                order.setPaid(true);
            }
        }
        Order order1 = orderRepository.save(order);
        return customMap(order1);
    }

    /**
     * Cancel order feature for customer.
     * @param orderId
     * @return
     */
    public OrderDTO cancelOrder(Long orderId){
        Order order = orderRepository.findByOrderId(orderId);
        if(order == null){
            return null;
        }
        if(!order.getStatus().equalsIgnoreCase("Packed") && !order.getStatus().equalsIgnoreCase("Placed")){
            return null;
        }
        List<OrderItem> items = order.getItems();
        for(OrderItem item: items){
            Product product = productClient.getProductById(item.getProductId());
            productClient.updateProductQuantity(product.getProductId(),
                    product.getProductQuantity() + item.getQuantity());
        }
        order.setStatus("Cancelled");
        EmailDTO emailDTO = emailDTOMapper(order);
        emailClient.sendCancelledStatus(emailDTO, "cancelled");
        emailClient.sendCancelledStatusSeller(emailDTO, "cancelled");
        return customMap(orderRepository.save(order));

    }

    public Boolean canReview(Long customerId, Long productId) {
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        for(Order order: orders) {
            if(order.getItems().stream().anyMatch(x -> x.getProductId().equals(productId))){
                return true;
            }
        }
        return false;
    }
}
