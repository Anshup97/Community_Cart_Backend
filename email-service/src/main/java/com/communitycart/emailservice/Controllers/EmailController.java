package com.communitycart.emailservice.Controllers;

import com.communitycart.emailservice.dtos.EmailDTO;
import com.communitycart.emailservice.service.EmailSenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/email")
//@CrossOrigin("*")
public class EmailController {

    @Autowired
    private EmailSenderService service;

    @PostMapping("/sendSimpleEmail")
    public ResponseEntity<?> sendSimpleEmail(@RequestParam String toEmail,
                                             @RequestParam String body,
                                             @RequestParam String subject) {
        service.sendSimpleEmail(toEmail, body, subject);
        return ResponseEntity.ok("Mail sending...");
    }

    @PostMapping("/sendHtmlEmail")
    public ResponseEntity<?> sendHtmlEmail(@RequestBody EmailDTO emailDTO) {
        service.sendHtmlEmail(emailDTO);
        return ResponseEntity.ok("Mail sending...");
    }

    @PostMapping("/sendUpdateDeliveryDate")
    public ResponseEntity<?> sendUpdateDeliveryDate(@RequestBody EmailDTO emailDTO, @RequestParam String date) {
        service.sendUpdateDeliveryDate(emailDTO, date);
        return ResponseEntity.ok("Mail sending...");
    }

    @PostMapping("/sendDeliveryStatus")
    public ResponseEntity<?> sendDeliveryStatus(@RequestBody EmailDTO emailDTO, @RequestParam String status) {
        service.sendDeliveryStatus(emailDTO, status);
        return ResponseEntity.ok("Mail sending...");
    }

    @PostMapping("/sendDeliveredStatus")
    public ResponseEntity<?> sendDeliveredStatus(@RequestBody EmailDTO emailDTO, @RequestParam String status) {
        service.sendDeliveredStatus(emailDTO, status);
        return ResponseEntity.ok("Mail sending...");
    }

    @PostMapping("/sendCancelledStatus")
    public ResponseEntity<?> sendCancelledStatus(@RequestBody EmailDTO emailDTO, @RequestParam String status) {
        service.sendCancelledStatus(emailDTO, status);
        return ResponseEntity.ok("Mail sending...");
    }

    @PostMapping("/sendCancelledStatusSeller")
    public ResponseEntity<?> sendCancelledStatusSeller(@RequestBody EmailDTO emailDTO, @RequestParam String status) {
        service.sendCancelledStatusSeller(emailDTO, status);
        return ResponseEntity.ok("Mail sending...");
    }
}
