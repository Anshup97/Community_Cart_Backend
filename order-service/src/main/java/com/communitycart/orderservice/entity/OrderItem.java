package com.communitycart.orderservice.entity;

import com.communitycart.orderservice.dtos.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "OrderItems")
public class OrderItem {
    @Id
    @SequenceGenerator(
            name = "order_items_sequence",
            sequenceName = "order_items_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.AUTO,
            generator = "order_items_sequence"
    )
    private Long orderItemId;

    private Long orderId;
    private Long quantity;
    private Long productId;
    private Double totalPrice;
    private Double itemPrice;
}
