package com.communitycart.orderservice.dtos;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Product {
    private Long productId;
    private String productName;
    private Double productPrice;
    private String productImageUrl;
    private Long productQuantity;
    private String productDescription;
    private String productSlug;
    private boolean productFeatured;
    private Double rating;
    private Long categoryId;
    private Long sellerId;
    private boolean isAvailable;

}
