package com.communitycart.reviewservice.service;

import com.communitycart.reviewservice.client.OrderClient;
import com.communitycart.reviewservice.client.ProductClient;
import com.communitycart.reviewservice.dto.Product;
import com.communitycart.reviewservice.dto.ReviewDTO;
import com.communitycart.reviewservice.model.Review;
import com.communitycart.reviewservice.repository.ReviewRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private OrderClient orderClient;

    @Autowired
    private ProductClient productClient;
    /**
     * Returns if a customer can review a product.
     * Returns true if a customer has purchased the product
     * else returns false.
     * @param customerId
     * @param productId
     * @return
     */
    public boolean canReview(Long customerId, Long productId){
        return orderClient.canReview(customerId, productId);
    }


    public void updateRating(Long productId){
        Product product = productClient.getProductById(productId);
        if(product != null){
            List<Review> reviews = reviewRepository.findByProductId(productId);
            if(!reviews.isEmpty()){
                Integer ratings = 0;
                for(Review r: reviews){
                    ratings += r.getRating();
                }
                Double productRating = (double) (ratings / reviews.size());
                productClient.updateRating(productId, productRating);
            } else {
                productClient.updateRating(productId, 0D);
            }
        }
    }


    /**
     * Post a review for a product.
     * If a customer has already reviewed a product, then the old review
     * will be updated.
     * @param review
     * @return
     */
    public ReviewDTO postReview(ReviewDTO review) {
        Product product = productClient.getProductById(review.getProductId());
        if(product == null || !canReview(review.getCustomerId(), review.getProductId())){
            return null;
        }
        ReviewDTO dto = null;
        List<Review> oldReview = reviewRepository.findByProductIdAndCustomerId(review.getProductId(),
                review.getCustomerId());
        if(!oldReview.isEmpty()){
            Review reviewOld = oldReview.get(0);
            reviewOld.setReview(review.getReview());
            reviewOld.setRating(review.getRating());
            dto = new ModelMapper().map(reviewRepository.save(reviewOld), ReviewDTO.class);
        } else {
            dto = new ModelMapper().map(reviewRepository.save(new ModelMapper().map(review, Review.class)),
                    ReviewDTO.class);
        }
        updateRating(review.getProductId());
        return dto;
    }

    /**
     * Get list of reviews of a product.
     * @param productId
     * @return
     */
    public List<ReviewDTO> getReviews(Long productId){
        Product product = productClient.getProductById(productId);
        if(product == null){
            return null;
        }
        List<Review> reviews = reviewRepository.findByProductId(productId);
        if(reviews.isEmpty()){
            return null;
        }
        return reviews.stream()
                .map(r -> new ModelMapper().map(r, ReviewDTO.class))
                .collect(Collectors.toList());
    }

    //Get review by reviewId.
    public ReviewDTO getReview(Long reviewId){
        Review review = reviewRepository.findByReviewId(reviewId);
        if(review == null){
            return null;
        }
        return new ModelMapper().map(review, ReviewDTO.class);
    }

    //Delete a review.
    public void deleteReview(Long reviewId){
        Review review = reviewRepository.findByReviewId(reviewId);
        Long productId = review.getProductId();
        reviewRepository.delete(review);
        updateRating(productId);
    }
}
