package com.communitycart.emailservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EmailDTO {
    private Long customerId;
    private Long orderId;
    private Double totalPrice;
    private String orderStatus;
    private Date deliveryDate;
    private Integer noOfItems;
    private String customerEmail;
    private String customerName;
    private String sellerEmail;
    private String sellerName;
    private String status;
}
