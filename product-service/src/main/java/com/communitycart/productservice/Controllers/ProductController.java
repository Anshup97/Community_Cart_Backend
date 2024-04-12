package com.communitycart.productservice.Controllers;

import com.communitycart.productservice.dtos.ProductDTO;
import com.communitycart.productservice.dtos.ProductOutOfStock;
import com.communitycart.productservice.dtos.ReviewDTO;
import com.communitycart.productservice.entity.Product;
import com.communitycart.productservice.repository.ProductRepository;
import com.communitycart.productservice.service.ProductService;
import com.communitycart.productservice.dtos.ProductDTO;
import com.communitycart.productservice.entity.Product;
import com.communitycart.productservice.repository.ProductRepository;
import com.communitycart.productservice.service.ProductService;
import com.communitycart.productservice.service.ReviewService;
import com.communitycart.productservice.service.SellerService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Product API for managing products.
 */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private SellerService sellerService;

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/")
    public String greeting() {
        return "hello";
    }

    /*
    This endpoint is used to add product for a seller.
     */
    @PostMapping("/addProduct")
    public ResponseEntity<ProductDTO> addProduct(@RequestBody ProductDTO productDTO){
        return new ResponseEntity<>(sellerService.addProduct(productDTO), HttpStatus.CREATED);
    }

    /*
    Upload image for a product.
     */
    @PostMapping(value = "/uploadImage/product", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadProductImage(@RequestParam("productId") Long productId,
                                                @RequestPart("productImage") MultipartFile productImage) throws Exception {
        String isUploaded = sellerService.uploadProductImage(productId, productImage);
        if(isUploaded.equals("-1")){
            return new ResponseEntity<>(new ArrayList<>(),
                    HttpStatus.OK);
        }
        return ResponseEntity.ok(isUploaded);
    }

    /*
    Get all products.
     */
    @GetMapping("/getAllProducts")
    public ResponseEntity<List<ProductDTO>> getSellerProducts(){
        List<Product> productList = productRepository.findAll();
        List<ProductDTO> productDTOS = new ArrayList<>();
        for(Product p: productList){
            productDTOS.add(new ModelMapper().map(p, ProductDTO.class));
        }
        return ResponseEntity.ok(productDTOS.stream()
                .filter(p -> p.getProductQuantity() > 0)
                .collect(Collectors.toList()));
    }

    /*
    Get all the products sold by a seller.
    If categoryId is null, list of seller products is returned.
    Else, list of seller products filtered by the categoryId is returned.
     */
    @GetMapping("/getProducts")
    public ResponseEntity<List<ProductDTO>> getProductsBySellerIdAndCategoryId(@RequestParam(required = false)
                                                                                   Long sellerId,
                                                                               @RequestParam(required = false)
                                                                               Long categoryId){
        List<ProductDTO> productDTOList = productService.getProductsBySellerIdAndCategoryId(sellerId, categoryId);
        if(productDTOList == null){
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
        }
        return new ResponseEntity<>(productDTOList.stream()
                .filter(p -> p.getProductQuantity() > 0)
                .collect(Collectors.toList()), HttpStatus.OK);
    }

    /*
    Get product by product Id.
     */
    @GetMapping("/getProduct")
    public ResponseEntity<?> getProductByProductId(@RequestParam Long productId){
        ProductDTO productDTO = productService.getProduct(productId);
        if(productDTO == null){
            return new ResponseEntity<>(null, HttpStatus.OK);
        }
        return new ResponseEntity<>(productDTO, HttpStatus.OK);
    }

    /*
    Update the product details.
     */
    @PutMapping("/updateProduct")
    public ResponseEntity<?> updateProduct(@RequestBody ProductDTO productDTO){
        ProductDTO res = productService.updateProduct(productDTO);
        if(res == null){
            return new ResponseEntity<>(null, HttpStatus.OK);
        }
        return new ResponseEntity<>(res, HttpStatus.OK);
    }


    /*
    Delete a product.
     */
    @DeleteMapping("/deleteProduct")
    public ResponseEntity<?> deleteProduct(@RequestParam Long productId){
        ProductDTO res = productService.deleteProduct(productId);
        if(res == null){
            return new ResponseEntity<>(null, HttpStatus.OK);
        }
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    /*
    Get seller products filtered by seller email and product category.
     */
    @GetMapping("/getProducts/{email}/{categoryId}")
    public ResponseEntity<List<ProductDTO>> getSellerProducts(@PathVariable("email") String email,
                                                              @PathVariable("categoryId") Long categoryId){
        List<ProductDTO> productDTOS = sellerService.getProductsBySeller(email, categoryId);
        if(productDTOS == null){
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
        }
        return new ResponseEntity<>(productDTOS, HttpStatus.OK);
    }

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

    /*
    Used by seller to mark a product as out of stock.
     */
    @PutMapping("/outOfStock")
    public ResponseEntity<?> productOutOfStock(@RequestBody ProductOutOfStock stock){
        System.out.println(stock.isAvailable());
        return ResponseEntity.ok(productService.setOutOfStock(stock));
    }

    @GetMapping("/getProductListByProductIds")
    public ResponseEntity<?> getProductListById(@RequestBody List<Long> productIds) {
        return ResponseEntity.ok(productService.getProductListById(productIds));
    }

    @PutMapping("/updateProductQuantity")
    public ResponseEntity<?> updateProductQuantity(@RequestParam Long productId, @RequestParam Long productQuantity) {
        return ResponseEntity.ok(productService.updateProductQuantity(productId, productQuantity));
    }

}
