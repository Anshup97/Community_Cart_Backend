package com.communitycart.authservice.controller;

import com.communitycart.authservice.dtos.AuthRequest;
import com.communitycart.authservice.dtos.UserDTO;
import com.communitycart.authservice.entity.User;
import com.communitycart.authservice.service.JWTService;
import com.communitycart.authservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.service.annotation.DeleteExchange;

@RestController
@RequestMapping("/auth")
//@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private JWTService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;

    //Test endpoint to check if server is running or not.
    @GetMapping("/")
    public ResponseEntity<String> helloWorld(){
        return new ResponseEntity<>("Hello!!", HttpStatus.OK);
    }

    /**
     * Authenticates both seller and customer and returns jwt token.
     * @param
     * @return
     */

    @PostMapping("/createUser")
    public ResponseEntity<?> createUser(@RequestBody UserDTO user) {
        userService.createUser(user);
        return ResponseEntity.ok("User added.");
    }
    @PostMapping("/authenticate")
    public ResponseEntity<String> authenticateAndGetToken(@RequestBody AuthRequest authRequest){
        if(authRequest.isSso()){
            User user = userService.getUser(authRequest.getEmail());
            if(user == null){
                return new ResponseEntity<>(null, HttpStatus.OK);
            }
            return new ResponseEntity<>( jwtService.generateToken(authRequest.getEmail()),
                    HttpStatus.OK);

        }
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                authRequest.getEmail(), authRequest.getPassword()
        ));
        if(authentication.isAuthenticated()){
            return new ResponseEntity<>( jwtService.generateToken(authRequest.getEmail()),
                    HttpStatus.OK);
        }
        return new ResponseEntity<>( null,
                HttpStatus.OK);
    }

    /*
    Get user role ('BUYER' or 'SELLER').
     */
    @GetMapping("/getRole/{emailId}")
    public ResponseEntity<?> getRole(@PathVariable String emailId){
        System.out.println(emailId);
        User user = userService.getUser(emailId);
        if(user == null){
            return new ResponseEntity<>(null, HttpStatus.OK);
        }
        return new ResponseEntity<>(userService.getUser(emailId).getRole(), HttpStatus.OK);
    }

    @GetMapping(value = "/getUser/{emailId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getUser(@PathVariable String emailId){
        User user = userService.getUser(emailId);
        System.out.println(emailId);
        System.out.println(user);
        if(user == null){
            return new ResponseEntity<>(null, HttpStatus.OK);
        }
        return new ResponseEntity<>(userService.getUser(emailId), HttpStatus.OK);
    }

    @DeleteMapping("/deleteUser/{email}")
    public void delete(@PathVariable String email){
        userService.deleteUser(email);
    }

    /*
    Forgot Password feature for all the users.
    An otp is sent to the email and the user has to verify the otp.
    This endpoint triggers the OTP email and also returns the OTP to the
    frontend for verification.
     */
    @PostMapping("/forgotPassword")
    public ResponseEntity<?> forgotPassword(@RequestParam String email){
        String otp = userService.forgotPassword(email);
        if(otp==null || otp.equalsIgnoreCase("")){
            return ResponseEntity.ok(null);
        }
        return ResponseEntity.ok(otp);
    }

    /*
    If the OTP is verified successfully, this endpoint is called
    which updates the new password. Password is always encoded before
    storing in the database.
     */
    @PostMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody AuthRequest authRequest){
        User user = userService.changePassword(authRequest.getEmail(), authRequest.getPassword());
        if(user==null){
            return ResponseEntity.ok(null);
        }
        return ResponseEntity.ok(null);
    }

}
