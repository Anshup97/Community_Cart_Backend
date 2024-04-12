package com.communitycart.productservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Seller DTO.
 * Used while creating seller, updating seller details and returning seller
 * details to the frontend.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SellerDTO {

    private Long sellerId;
    private String email;
    private String name;
    private String contactPhoneNo;
    private String aadharNo;
    private String password;
    private String shopPhotoUrl;
    private String shopName;
    private AddressDTO address;
    private String gstin;

}
