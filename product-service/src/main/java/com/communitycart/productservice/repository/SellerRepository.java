package com.communitycart.productservice.repository;

import com.communitycart.productservice.entity.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerRepository extends JpaRepository<Seller, Long> {

    public Seller findByEmail(String email);
    public Seller deleteByEmail(String email);


}
