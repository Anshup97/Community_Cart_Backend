package com.communitycart.productservice.config;

import com.communitycart.productservice.client.OrderClient;
import com.communitycart.productservice.client.UserClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.loadbalancer.reactive.LoadBalancedExchangeFilterFunction;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.support.WebClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
public class WebClientConfig {
    @Autowired
    private LoadBalancedExchangeFilterFunction filterFunction;
    @Bean
    public WebClient authWebClient() {
        return WebClient.builder()
                .baseUrl("http://auth-service")
                .filter(filterFunction)
                .build();
    }

    @Bean
    public WebClient orderWebClient() {
        return WebClient.builder()
                .baseUrl("http://order-service")
                .filter(filterFunction)
                .build();
    }

    @Bean
    public UserClient userClient() {
        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory.builderFor(WebClientAdapter
                        .create(authWebClient()))
                .build();
        return httpServiceProxyFactory.createClient(UserClient.class);
    }

    @Bean
    public OrderClient orderClient() {
        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory.builderFor(WebClientAdapter
                        .create(orderWebClient()))
                .build();
        return httpServiceProxyFactory.createClient(OrderClient.class);
    }
}
