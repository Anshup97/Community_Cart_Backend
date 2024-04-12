package com.communitycart.orderservice.client;

import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange
public interface OrderClient {

    @GetExchange("/order/canReview")
    boolean canReview(Long customerId, Long productId);

}
