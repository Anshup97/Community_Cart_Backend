package com.communitycart.orderservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "CartItem")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CartItem {
    @Id
    @SequenceGenerator(name = "cart_item_sequence",
    sequenceName = "cart_item_sequence",
    allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "cart_item_sequence")
    private Long cartItemId;
    private Long productId;
    private Long quantity;
    private Long cartId;
}
