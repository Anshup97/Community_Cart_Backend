package com.communitycart.orderservice.config;

import com.communitycart.orderservice.client.EmailClient;
import com.communitycart.orderservice.client.ProductClient;
import com.communitycart.orderservice.client.OrderClient;
import com.communitycart.orderservice.client.UserClient;
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
    public WebClient productWebClient() {
        return WebClient.builder()
                .baseUrl("http://product-service")
                .filter(filterFunction)
                .build();
    }

    @Bean
    public WebClient emailWebClient() {
        return WebClient.builder()
                .baseUrl("http://email-service")
                .filter(filterFunction)
                .build();
    }

    @Bean
    public ProductClient productClient() {
        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory.builderFor(WebClientAdapter
                        .create(productWebClient()))
                .build();
        return httpServiceProxyFactory.createClient(ProductClient.class);
    }

    @Bean
    public OrderClient orderClient() {
        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory.builderFor(WebClientAdapter
                        .create(orderWebClient()))
                .build();
        return httpServiceProxyFactory.createClient(OrderClient.class);
    }

    @Bean
    public UserClient userClient() {
        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory.builderFor(WebClientAdapter
                        .create(authWebClient()))
                .build();
        return httpServiceProxyFactory.createClient(UserClient.class);
    }

    @Bean
    public EmailClient emailClient() {
        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory.builderFor(WebClientAdapter
                        .create(emailWebClient()))
                .build();
        return httpServiceProxyFactory.createClient(EmailClient.class);
    }
}
