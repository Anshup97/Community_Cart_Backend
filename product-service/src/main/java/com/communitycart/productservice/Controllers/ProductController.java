package com.communitycart.productservice.Controllers;

import com.communitycart.productservice.dtos.ProductDTO;
import com.communitycart.productservice.dtos.ProductOutOfStock;
import com.communitycart.productservice.entity.Product;
import com.communitycart.productservice.repository.ProductRepository;
import com.communitycart.productservice.service.ProductService;
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
//@CrossOrigin(origins = "*")
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private SellerService sellerService;

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
        Product productDTO = productService.getProduct(productId);
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

    @PostMapping("/updateRating")
    public ResponseEntity<?> updateRating(@RequestParam Long productId, @RequestParam Double rating) {
        productService.updateRating(productId, rating);
        return ResponseEntity.ok(null);
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
