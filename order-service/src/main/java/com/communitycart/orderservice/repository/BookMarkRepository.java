package com.communitycart.orderservice.repository;

import com.communitycart.orderservice.entity.BookMark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookMarkRepository extends JpaRepository<BookMark, Long> {
    public List<BookMark> findByCustomerId(Long customerId);
    public BookMark findBookMarkByCustomerIdAndProductId(Long customerId, Long productId);
}
