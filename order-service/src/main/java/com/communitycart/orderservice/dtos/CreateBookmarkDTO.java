package com.communitycart.orderservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CreateBookmarkDTO {

    private Long bookMarkId;
    private Long customerId;
    private Long productId;

}
