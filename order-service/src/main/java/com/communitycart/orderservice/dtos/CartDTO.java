package com.communitycart.orderservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

/**
 * Cart DTO for showing products in the cart of a user.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CartDTO {

    private Long cartId;
    private Long customerId;
    private List<CartItemDTO> items;
    private Double totalPrice;
}
