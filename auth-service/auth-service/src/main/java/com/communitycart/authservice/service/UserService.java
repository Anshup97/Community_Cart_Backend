package com.communitycart.authservice.service;

import com.communitycart.authservice.client.EmailClient;
import com.communitycart.authservice.dtos.UserDTO;
import com.communitycart.authservice.entity.User;
import com.communitycart.authservice.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailClient emailClient;
    public User getUser(String email) {
        return usersRepository.findByEmailId(email);
    }

    public void createUser(UserDTO user) {
        User user1 = new User(user.getEmailId(), passwordEncoder.encode(user.getPassword()), user.getRole());
        usersRepository.save(user1);
    }

    public List<User> findAll() {
        return usersRepository.findAll();
    }

    public void deleteUser(String email) {
        User user = usersRepository.findByEmailId(email);
        if(user != null) {
            usersRepository.delete(user);
        }

    }

    public String forgotPassword(String email){
        User user = usersRepository.findByEmailId(email);
        if(user == null){
            return null;
        }
        String otp = String.valueOf(new Random().nextInt(999999));
        String sub = "One Time Password (OTP) for Account recovery process on Community Cart";
        String body = "Your OTP for Forgot Password recovery of user id " + email  + "on Community Cart is "
                + otp;
        emailClient.sendSimpleEmail(email, body, sub);
        return otp;
    }

    public User changePassword(String email, String password){
        System.out.println(password);
        User user = usersRepository.findByEmailId(email);
        if(user == null){
            return null;
        }
        user.setPassword(passwordEncoder.encode(password));
        return usersRepository.save(user);
    }
}
