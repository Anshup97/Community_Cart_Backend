package com.communitycart.orderservice.client;

import com.communitycart.orderservice.entity.User;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange
public interface UserClient {

    @PostExchange("/auth/createUser")
    void save(@RequestBody User user);

    @GetExchange("/auth/getUser/{emailId}")
    User findByEmailId(@PathVariable(name = "emailId") String emailId);

    @DeleteExchange("/auth/deleteUser/{email}")
    void delete(@PathVariable String email);
}
