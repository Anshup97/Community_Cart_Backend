package com.communitycart.orderservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "Orders")
public class Order {

    @Id
    @SequenceGenerator(
            name = "order_sequence",
            sequenceName = "order_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.AUTO,
            generator = "order_sequence"
    )
    private Long orderId;
    private Long customerId;
    private Long sellerId;
    private String paymentMethod;
    private Double totalPrice;
    private Double shippingCharges;
    private boolean isPaid;
    private Date createdAt;
    private Date deliveryDate;
    private Date deliveredAt;
    private String status;
    private String sessionId;
    private Long addressId;
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "orderId", referencedColumnName = "orderId")
    private List<OrderItem> items;

}
