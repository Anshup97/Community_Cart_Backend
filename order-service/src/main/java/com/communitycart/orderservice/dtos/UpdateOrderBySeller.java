package com.communitycart.orderservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;

/**
 * DTO used for updating order details by seller.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UpdateOrderBySeller {

    private Long orderId;
    private boolean isPaid;
//    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private Date deliveryDate;
//    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private Date deliveredAt;
    private String status;


}
