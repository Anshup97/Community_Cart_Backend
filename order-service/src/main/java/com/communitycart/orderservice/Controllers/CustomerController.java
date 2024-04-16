package com.communitycart.orderservice.Controllers;

import com.communitycart.orderservice.dtos.CustomerDTO;
import com.communitycart.orderservice.entity.User;
import com.communitycart.orderservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * Customer API class for managing customers.
 */
@RestController
//@CrossOrigin("*")
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private UserService userService;

    /**
     * Add a customer to the database.
     * Customer details entered by the customer while signup is passed to this endpoint
     * and customer is added.
     * If customer is already present, it doesn't add the customer and returns null.
     * @param customer
     * @return
     */
    @PostMapping("/addCustomer")
    public ResponseEntity<CustomerDTO> addCustomer(@RequestBody CustomerDTO customer){
        User user = userService.getUser(customer.getEmail());
        if(user == null){
            CustomerDTO customerDTO = userService.addCustomer(customer);
            return new ResponseEntity<>(customerDTO,
                    HttpStatus.CREATED) {
            };
        }
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    /**
     * Get customer details from database using customerId.
     * @param customerId
     * @return
     */
    @GetMapping("/getCustomer")
    public ResponseEntity<?> getCustomer(@RequestParam Long customerId){
        CustomerDTO customer = userService.getCustomer(customerId);
        System.out.println(customer);
        if(customer == null){
            return new ResponseEntity<>(null, HttpStatus.OK);
        }
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    /**
     * Delete a customer.
     * @param email
     * @return
     */
    @DeleteMapping("/deleteCustomer")
    @Transactional
    public ResponseEntity<?> deleteCustomer(@RequestParam String email){
        CustomerDTO customerDTO = userService.deleteCustomer(email);
        if(customerDTO == null){
            return new ResponseEntity<>(null, HttpStatus.OK);
        }
        return ResponseEntity.ok(customerDTO);
    }

    @PostMapping("/updateCustomer")
    public ResponseEntity<?> updateCustomer(@RequestBody CustomerDTO customerDTO){
        CustomerDTO customerDTO1 = userService.updateCustomer(customerDTO);
        if(customerDTO1 == null){
            return new ResponseEntity<>(null, HttpStatus.OK);
        }
        return ResponseEntity.ok(customerDTO);
    }

    @PostMapping(value = "/uploadPhoto/profile", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> uploadPhoto(@RequestParam("email") String email,
                                         @RequestPart("profilePhoto") MultipartFile profilePhoto)
            throws Exception {
        User user = userService.getUser(email);
        if(user != null){
            if(user.getRole().equals("BUYER")){
                CustomerDTO customer = userService.uploadCustomerPhoto(email, profilePhoto);
                return new ResponseEntity<>(customer, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @GetMapping("/getCustomerByEmail")
    public ResponseEntity<Long> getCustomerByEmail(@RequestParam String email) {
        return ResponseEntity.ok(userService.getCustomerByEmail(email));
    }
}
