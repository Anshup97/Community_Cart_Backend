package com.communitycart.orderservice.client;

import com.communitycart.orderservice.dtos.ProductDTO;
import com.communitycart.orderservice.dtos.SellerDTO;
import com.communitycart.orderservice.dtos.Product;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PutExchange;

import java.util.List;

@HttpExchange
public interface ProductClient {

    @GetExchange("/product/getProductListByProductIds")
    List<ProductDTO> getProductListById(@RequestBody List<Long> productIds);

    @GetExchange("/product/getProduct")
    Product getProductById(@RequestParam Long productId);

    @PutExchange("/product/updateProductQuantity")
    Product updateProductQuantity(@RequestParam Long productId, @RequestParam Long productQuantity);

    @GetExchange("/seller/getSeller")
    List<SellerDTO> getSeller(@RequestParam(name = "sellerId", required = false) Long sellerId);
}
