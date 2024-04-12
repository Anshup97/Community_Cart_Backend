package com.communitycart.orderservice.repository;

import com.communitycart.orderservice.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, String> {

    public Customer findCustomerByEmail(String email);

    public Customer deleteByEmail(String email);

    public Customer findByCustomerId(Long customerId);
}
