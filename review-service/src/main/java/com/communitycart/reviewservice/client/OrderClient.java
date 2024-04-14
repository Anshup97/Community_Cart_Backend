package com.communitycart.reviewservice.client;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange
public interface OrderClient {

    @GetExchange("/order/canReview")
    boolean canReview(@RequestParam Long customerId, @RequestParam Long productId);

}
