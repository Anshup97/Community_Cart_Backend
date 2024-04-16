package com.communitycart.authservice.client;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange
public interface SellerClient {

    @GetExchange("/seller/getSellerByEmail")
    Long getSellerByEmail(@RequestParam String email);

}
