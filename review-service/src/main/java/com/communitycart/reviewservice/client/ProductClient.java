package com.communitycart.reviewservice.client;

import com.communitycart.reviewservice.dto.Product;
import com.communitycart.reviewservice.dto.ProductDTO;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

import java.util.List;

@HttpExchange
public interface ProductClient {

    @GetExchange("/product/getProduct")
    Product getProductById(@RequestParam Long productId);

    @PostExchange("/product/updateRating")
    void updateRating(@RequestParam Long productId, @RequestParam Double rating);


}
