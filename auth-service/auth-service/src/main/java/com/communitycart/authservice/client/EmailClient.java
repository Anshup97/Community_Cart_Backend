package com.communitycart.authservice.client;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange
public interface EmailClient {

    @PostExchange("/email/sendSimpleEmail")
    void sendSimpleEmail(@RequestParam String toEmail,
                                      @RequestParam String body,
                                      @RequestParam String subject);
}
