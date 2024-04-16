package com.communitycart.authservice.client;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange
public interface CustomerClient {

    @GetExchange("/customer/getCustomerByEmail")
    Long getCustomerByEmail(@RequestParam String email);

}
