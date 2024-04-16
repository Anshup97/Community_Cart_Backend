package com.communitycart.orderservice.service;

import com.communitycart.orderservice.client.ProductClient;
import com.communitycart.orderservice.dtos.CartDTO;
import com.communitycart.orderservice.dtos.CartItemDTO;
import com.communitycart.orderservice.dtos.ProductDTO;
import com.communitycart.orderservice.entity.Cart;
import com.communitycart.orderservice.entity.CartItem;
import com.communitycart.orderservice.entity.Customer;
import com.communitycart.orderservice.dtos.Product;
import com.communitycart.orderservice.repository.CartItemRepository;
import com.communitycart.orderservice.repository.CartRepository;
import com.communitycart.orderservice.repository.CustomerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Cart service class to manage cart and cart items of a customer.
 */
@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductClient productClient;


    //ModelMapper is used to map Entity object to dto object.
    public ModelMapper mapper(){
        return new ModelMapper();
    }

    /**
     * Get cart along with cart items added to the cart by the customer.
     * @param customerId
     * @return
     */
    public CartDTO getCart(Long customerId) {
        Customer customer = customerRepository.findByCustomerId(customerId);
        if(customer == null){
            return null;
        }
        Cart cart = customer.getCart();
        CartDTO cartDTO = new CartDTO();
        cartDTO.setCartId(cart.getCartId());
        cartDTO.setCustomerId(customerId);
        List<CartItem> items = cart.getItems();
        List<CartItemDTO> itemsDTOS = new ArrayList<>();
        List<ProductDTO> prods = productClient.getProductListById(items.stream()
                .map(CartItem::getProductId)
                .collect(Collectors.toList()));
        for(CartItem ci: items) {
            CartItemDTO dto = new CartItemDTO();
            dto.setCartId(ci.getCartId());
            dto.setCartItemId(ci.getCartItemId());
            dto.setQuantity(ci.getQuantity());
            dto.setProduct(prods.stream()
                    .filter(p -> p.getProductId().equals(ci.getProductId()))
                    .findFirst().get());
            itemsDTOS.add(dto);
        }
        cartDTO.setItems(itemsDTOS);
        cartDTO.setTotalPrice(cart.getTotalPrice());
        return cartDTO;
    }

    /**
     * Add item to the cart.
     * If the item is already present, update the quantity.
     * @param customerId
     * @param item
     * @return
     */
    public CartDTO addToCart(Long customerId, CartItemDTO item) {
        Customer customer = customerRepository.findByCustomerId(customerId);
        if(customer == null){
            return null;
        }
        Cart cart = customerRepository.findByCustomerId(customerId).getCart();
        List<CartItem> items = cart.getItems();
        if(items == null){
            items = new ArrayList<>();
        }
        long count = items.stream()
                .filter(x -> x.getProductId().equals(item.getProduct().getProductId()))
                .count();
        if(count == 0){
            CartItem cartItem = new CartItem();
            cartItem.setCartId(cart.getCartId());
            cartItem.setProductId(item.getProduct().getProductId());
            cartItem.setQuantity(item.getQuantity());

            items.add(cartItem);
            cart.setItems(items);
            double price = item.getProduct().getProductPrice() * item.getQuantity();
            if(cart.getTotalPrice() == null){
                cart.setTotalPrice(0D);
            }
            cart.setTotalPrice(cart.getTotalPrice() + price);

        } else {
            for(CartItem x: items){
                if(x.getProductId().equals(item.getProduct().getProductId())){
                    x.setQuantity(x.getQuantity() + item.getQuantity());
                    double price = item.getProduct().getProductPrice() * item.getQuantity();
                    cart.setTotalPrice(cart.getTotalPrice() + price);
                    break;
                }
            }

        }
        cartRepository.save(cart);
        customer.setCart(cart);
        return mapper().map(customerRepository.save(customer).getCart(), CartDTO.class);
    }

    /**
     * Update cart items.
     * Deletes existing items in the cart and add new items.
     * @param customerId
     * @param items
     * @return
     */
    public CartDTO updateCart(Long customerId, List<CartItemDTO> items) {
        Customer customer = customerRepository.findByCustomerId(customerId);
        if(customer == null){
            return null;
        }
        CartDTO cart = deleteFromCart(customerId, null);
        for(CartItemDTO x: items){
            cart = addToCart(customerId, x);
        }
        return cart;
    }

    /**
     * If productId is null, delete all cart items.
     * Else delete item from cart whose productId matches.
     * @param customerId
     * @param productId
     * @return
     */
    @Transactional
    public CartDTO deleteFromCart(Long customerId, Long productId) {
        Customer customer = customerRepository.findByCustomerId(customerId);
        if(customer == null){
            return null;
        }
        Cart cart = customer.getCart();
        List<CartItem> cartItems = cart.getItems();
        CartItem temp = null;
        if(productId == null){
            for(CartItem ci: cartItems){
                ci.setProductId(null);
                cartItemRepository.save(ci);
                cartItemRepository.delete(ci);
            }
            customer.getCart().setItems(new ArrayList<>());
            customer.getCart().setTotalPrice(0D);

        } else {
            for(CartItem x: cartItems){
                if(x.getProductId().equals(productId)){
                    temp = x;
                    x.setProductId(null);
                    cartItemRepository.save(x);
                    cartItemRepository.delete(x);
                    break;
                }
            }
            if(temp != null){
                cartItems.remove(temp);
                cart.setTotalPrice(cart.getTotalPrice() -
                        productClient.getProductById(productId).getProductPrice()* temp.getQuantity());
            }
        }
        cartRepository.save(cart);
        customer.setCart(cart);
        return mapper().map(customerRepository.save(customer).getCart(), CartDTO.class);
    }
}
