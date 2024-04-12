package com.communitycart.orderservice.service;

import com.communitycart.orderservice.client.UserClient;
import com.communitycart.orderservice.dtos.AddressDTO;
import com.communitycart.orderservice.dtos.CustomerDTO;
import com.communitycart.orderservice.entity.*;
import com.communitycart.orderservice.repository.CustomerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Random;

@Service
public class UserService {
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private FileStorageService fIleStorageService;
    @Autowired
    private UserClient userClient;
    @Autowired
    private ImageStorageService imageStorageService;
    public User getUser(String emailId){
        return userClient.findByEmailId(emailId);
    }

    public void createUser(User user){
        userClient.save(user);
    }

    public void deleteUser(String email){
        userClient.delete(email);
    }


    Address createAddress(AddressDTO addressDTO){
        Address address = new Address();
        address.setAddress1(addressDTO.getAddress1());
        address.setAddress2(addressDTO.getAddress2());
        address.setCity(addressDTO.getCity());
        address.setDistrict(addressDTO.getDistrict());
        address.setState(addressDTO.getState());
        address.setPinCode(addressDTO.getPinCode());
        address.setLatitude(addressDTO.getLatitude());
        address.setLongitude(addressDTO.getLongitude());
        return address;
    }

    public CustomerDTO addCustomer(CustomerDTO customer){
        Customer customerEntity = new Customer();
        customerEntity.setName(customer.getName());
        customerEntity.setEmail(customer.getEmail());
        customerEntity.setContactPhoneNo(customer.getContactPhoneNo());
        customerEntity.setAddress(new ModelMapper().map(customer.getAddress(), Address.class));
        customerEntity.setCart(new Cart());
        customerEntity.getCart().setTotalPrice(0D);
        createUser(new User(customer.getEmail(), customer.getPassword(), "BUYER"));
        return new ModelMapper().map(customerRepository.save(customerEntity), CustomerDTO.class);
    }

    public CustomerDTO updateCustomer(CustomerDTO customer){
        Customer customerEntity = customerRepository.findCustomerByEmail(customer.getEmail());
        if(customerEntity != null){
            customerEntity.setName(customer.getName());
            customerEntity.setEmail(customer.getEmail());
            customerEntity.setContactPhoneNo(customer.getContactPhoneNo());
            customerEntity.setAddress(new ModelMapper().map(customer.getAddress(), Address.class));
            return new ModelMapper().map(customerRepository.save(customerEntity), CustomerDTO.class);
        }
        return null;
    }


    public CustomerDTO deleteCustomer(String email){
        Customer customer = customerRepository.findCustomerByEmail(email);
        if(customer == null){
            return null;
        }
        deleteUser(customer.getEmail());
        CustomerDTO customerDTO = new ModelMapper().map(customer, CustomerDTO.class);
        customerRepository.delete(customer);
        return customerDTO;
    }


    public CustomerDTO getCustomer(Long customerId){
        Customer customer = customerRepository.findByCustomerId(customerId);
        if(customer != null){
            CustomerDTO customerDTO = new CustomerDTO();
            customerDTO.setCustomerId(customer.getCustomerId());
            customerDTO.setName(customer.getName());
            customerDTO.setEmail(customer.getEmail());
            customerDTO.setContactPhoneNo(customer.getContactPhoneNo());
            customerDTO.setAddress(new ModelMapper().map(customer.getAddress(), AddressDTO.class));
            customerDTO.setCustomerImageUrl(customer.getCustomerImageUrl());
            return customerDTO;
        }
        return null;
    }

    public CustomerDTO uploadCustomerPhoto(String email, MultipartFile profilePhoto) throws Exception {
        Customer customer = customerRepository.findCustomerByEmail(email);
        if(customer != null){
            String url = fIleStorageService.saveCustomerPhoto(profilePhoto, customer.getCustomerId());
            url = "http://172.17.84.65:8080/images/customers/" + url;
            customer.setCustomerImageUrl(url);
            return new ModelMapper().map(customerRepository.save(customer), CustomerDTO.class);
        }
        return null;
    }

}
