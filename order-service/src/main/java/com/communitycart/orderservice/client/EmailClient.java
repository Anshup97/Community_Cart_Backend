package com.communitycart.orderservice.client;

import com.communitycart.orderservice.dtos.EmailDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange
public interface EmailClient {

    @PostExchange("/email/sendSimpleEmail")
    void sendSimpleEmail(@RequestParam String toEmail,
                                      @RequestParam String body,
                                      @RequestParam String subject);
    @PostExchange("/email/sendHtmlEmail")
    void sendHtmlEmail(@RequestBody EmailDTO emailDTO);

    @PostExchange("/email/sendUpdateDeliveryDate")
    void sendUpdateDeliveryDate(@RequestBody EmailDTO emailDTO, @RequestParam String date);

    @PostExchange("/email/sendDeliveryStatus")
    void sendDeliveryStatus(@RequestBody EmailDTO emailDTO, @RequestParam String status);

    @PostExchange("/email/sendDeliveredStatus")
    void sendDeliveredStatus(@RequestBody EmailDTO emailDTO, @RequestParam String status);

    @PostExchange("/email/sendCancelledStatus")
    void sendCancelledStatus(@RequestBody EmailDTO emailDTO, @RequestParam String status);

    @PostExchange("/email/sendCancelledStatusSeller")
    void sendCancelledStatusSeller(@RequestBody EmailDTO emailDTO, @RequestParam String status);
}
