package com.communitycart.authservice.config;

import com.communitycart.authservice.client.CustomerClient;
import com.communitycart.authservice.client.EmailClient;
import com.communitycart.authservice.client.SellerClient;
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
    public WebClient emailWebClient() {
        return WebClient.builder()
                .baseUrl("http://email-service")
                .filter(filterFunction)
                .build();
    }

    @Bean
    public EmailClient emailClient() {
        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory.builderFor(WebClientAdapter
                        .create(emailWebClient()))
                .build();
        return httpServiceProxyFactory.createClient(EmailClient.class);
    }

    @Bean
    public WebClient sellerWebClient() {
        return WebClient.builder()
                .baseUrl("http://product-service")
                .filter(filterFunction)
                .build();
    }

    @Bean
    public SellerClient sellerClient() {
        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory.builderFor(WebClientAdapter
                        .create(sellerWebClient()))
                .build();
        return httpServiceProxyFactory.createClient(SellerClient.class);
    }

    @Bean
    public WebClient customerWebClient() {
        return WebClient.builder()
                .baseUrl("http://order-service")
                .filter(filterFunction)
                .build();
    }

    @Bean
    public CustomerClient customerClient() {
        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory.builderFor(WebClientAdapter
                        .create(customerWebClient()))
                .build();
        return httpServiceProxyFactory.createClient(CustomerClient.class);
    }


}
