package com.communitycart.emailservice.service;

import com.communitycart.emailservice.dtos.EmailDTO;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * Service class to send emails to customers
 * and sellers.
 */
@Service
public class EmailSenderService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private ThymeLeafService thymeLeafService;

    //Application email id.
    @Value("${companyemailid}")
    private String from;

    /**
     * Used to send simple email - plain text subject and body.
     * Used for sending OTP for password change.
     * @param toEmail
     * @param body
     * @param subject
     */

    @Async
    public void sendSimpleEmail(String toEmail,
                                String body,
                                String subject) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(from);
        message.setTo(toEmail);
        message.setText(body);
        message.setSubject(subject);

        mailSender.send(message);
        System.out.println("Mail Send...");
    }

    /**
     * Used to send emails with body as HTML.
     * Used to send order confirmation emails to customers.
     * Template is present in resources/templates folder.
     * Details are sent dynamically to the template using Thymeleaf.
     */
    @Async
    public void sendHtmlEmail(EmailDTO emailDTO) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());
            helper.setPriority(1);
            helper.setSubject("Your CommunityCart order " + emailDTO.getOrderId() + " of "
                    + emailDTO.getNoOfItems() + " items placed.");
            helper.setFrom(from);
            helper.setTo(emailDTO.getCustomerEmail());
            helper.setText(thymeLeafService.createContent("orderConfirmation.html",
                    Map.of("orderId", emailDTO.getOrderId(), "totalPrice", emailDTO.getTotalPrice(), "name",
                            emailDTO.getCustomerName())), true);
            mailSender.send(message);
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            throw new RuntimeException(exception.getMessage());
        }
    }

    /**
     * Used to send emails with body as HTML.
     * Used to send order delivery date emails to customers.
     * Template is present in resources/templates folder.
     * Details are sent dynamically to the template using Thymeleaf.
     * @param emailDTO
     * @param date
     */
    @Async
    public void sendUpdateDeliveryDate(EmailDTO emailDTO, String date) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());
            helper.setPriority(1);
            helper.setSubject("Your order will be delivered by " + date + ".");
            helper.setFrom(from);
            helper.setTo(emailDTO.getCustomerEmail());
            helper.setText(thymeLeafService.createContent("deliverydate.html",
                    Map.of("orderId", emailDTO.getOrderId(), "deliveryDate", date,
                            "totalPrice", emailDTO.getTotalPrice(),
                            "status", emailDTO.getStatus(),
                            "name",
                            emailDTO.getCustomerName())), true);
            mailSender.send(message);
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            throw new RuntimeException(exception.getMessage());
        }
    }

    /**
     * Used to send emails with body as HTML.
     * Used to send order delivery status to customers.
     * Template is present in resources/templates folder.
     * Details are sent dynamically to the template using Thymeleaf.
     * @param emailDTO
     * @param status
     */
    @Async
    public void sendDeliveryStatus(EmailDTO emailDTO, String status) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());
            helper.setPriority(1);
            helper.setSubject("Your order is " + status + ".");
            helper.setFrom(from);
            helper.setTo(emailDTO.getCustomerEmail());
            if(emailDTO.getDeliveryDate() != null){
                helper.setText(thymeLeafService.createContent("orderStatus.html",
                        Map.of("orderId", emailDTO.getOrderId(), "status", status,
                                "totalPrice", emailDTO.getTotalPrice(),
                                "deliveryDate", emailDTO.getDeliveryDate(),
                                "name",
                                emailDTO.getCustomerName())), true);
            } else {
                helper.setText(thymeLeafService.createContent("orderStatus.html",
                        Map.of("orderId", emailDTO.getOrderId(), "status", status,
                                "totalPrice", emailDTO.getTotalPrice(),
                                "deliveryDate", "To be confirmed by the seller.",
                                "name",
                                emailDTO.getCustomerName())), true);
            }
            mailSender.send(message);
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            throw new RuntimeException(exception.getMessage());
        }
    }

    /**
     * Used to send emails with body as HTML.
     * Used to send order delivery confirmation to customers.
     * Template is present in resources/templates folder.
     * Details are sent dynamically to the template using Thymeleaf.
     * @param emailDTO
     * @param status
     */
    @Async
    public void sendDeliveredStatus(EmailDTO emailDTO, String status) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());
            helper.setPriority(1);
            helper.setSubject("Your order " + emailDTO.getOrderId() + " is " + status + ".");
            helper.setFrom(from);
            helper.setTo(emailDTO.getCustomerEmail());
            helper.setText(thymeLeafService.createContent("delivered.html",
                    Map.of("orderId", emailDTO.getOrderId(),
                            "name",
                            emailDTO.getCustomerName())), true);
            mailSender.send(message);
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            throw new RuntimeException(exception.getMessage());
        }
    }

    @Async
    public void sendCancelledStatus(EmailDTO emailDTO, String status) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());
            helper.setPriority(1);
            helper.setSubject("Your order " + emailDTO.getOrderId() + " is " + status + ".");
            helper.setFrom(from);
            helper.setTo(emailDTO.getCustomerEmail());
            helper.setText(thymeLeafService.createContent("cancelled.html",
                    Map.of("orderId", emailDTO.getOrderId(),
                            "name",
                            emailDTO.getCustomerName())), true);
            mailSender.send(message);
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            throw new RuntimeException(exception.getMessage());
        }
    }

    @Async
    public void sendCancelledStatusSeller(EmailDTO emailDTO, String status) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());
            helper.setPriority(1);
            helper.setSubject("Order " + emailDTO.getOrderId() + " is " + status + ".");
            helper.setFrom(from);
            helper.setTo(emailDTO.getSellerEmail());
            helper.setText(thymeLeafService.createContent("cancelledSeller.html",
                    Map.of("orderId", emailDTO.getOrderId(),
                            "name",
                            emailDTO.getSellerName())), true);
            mailSender.send(message);
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            throw new RuntimeException(exception.getMessage());
        }
    }
}
