package com.communitycart.reviewservice.controller;

import com.communitycart.reviewservice.dto.ReviewDTO;
import com.communitycart.reviewservice.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//@CrossOrigin("*")
@RestController
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;
    /*
    Add customer reviews for a product.
    If a customer has already reviewed, update that review.
     */
    @PostMapping("/postReview")
    public ResponseEntity<?> postReview(@RequestBody ReviewDTO review){
        ReviewDTO rev = reviewService.postReview(review);
        return new ResponseEntity<>(rev, HttpStatus.OK);
    }

    /*
    Get all the reviews for a product using productId.
     */
    @GetMapping("/getReviews")
    public ResponseEntity<?> getReviews(@RequestParam Long productId){
        return ResponseEntity.ok(reviewService.getReviews(productId));
    }

    /*
    Get a review using reviewId.
     */
    @GetMapping("/getReview")
    public ResponseEntity<?> getReview(@RequestParam Long reviewId){
        return ResponseEntity.ok(reviewService.getReview(reviewId));
    }

    /*
    Delete a review using reviewId.
     */
    @DeleteMapping("/deleteReview")
    public ResponseEntity<?> deleteReview(@RequestParam Long reviewId){
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok(null);
    }

    /*
    Check if a customer is eligible to review a product.
    If the customer has purchased a product, then only the
    customer is eligible to review that product.
     */
    @GetMapping("/canReview")
    public ResponseEntity<?> canReview(@RequestParam Long customerId, @RequestParam Long productId){
        return ResponseEntity.ok(reviewService.canReview(customerId, productId));
    }
}
