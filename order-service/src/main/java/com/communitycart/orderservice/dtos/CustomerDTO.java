package com.communitycart.orderservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CustomerDTO {

    private Long customerId;
    private String name;
    private String email;
    private String contactPhoneNo;
    private AddressDTO address;
    private String password;
    private String customerImageUrl;


}
