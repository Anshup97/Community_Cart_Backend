package com.communitycart.productservice.repository;

import com.communitycart.productservice.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    public List<Review> findByProductId(Long productId);

    public Review findByReviewId(Long reviewId);

    public List<Review> findByProductIdAndCustomerId(Long productId, Long customerId);
}
