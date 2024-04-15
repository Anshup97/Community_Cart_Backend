package com.communitycart.productservice.service;

import com.communitycart.productservice.dtos.ProductDTO;
import com.communitycart.productservice.dtos.ProductOutOfStock;
import com.communitycart.productservice.entity.Product;
import com.communitycart.productservice.entity.Seller;
import com.communitycart.productservice.repository.ProductRepository;
import com.communitycart.productservice.repository.SellerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Product service class for serving various product
 * functionalities.
 */
@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SellerRepository sellerRepository;


    /**
     * Get list of all products.
     * @return
     */
    public List<ProductDTO> getAllProducts(){
        List<Product> productList = productRepository.findAll();
        List<ProductDTO> productDTOS = new ArrayList<>();
        for(Product p: productList){
            productDTOS.add(new ModelMapper().map(p, ProductDTO.class));
        }
        return productDTOS;
    }

    /**
     * Get a filtered list of products by sellerId and categoryId.
     * @param sellerId
     * @param categoryId
     * @return
     */
    public List<ProductDTO> getProductsBySellerIdAndCategoryId(Long sellerId, Long categoryId){
        if(sellerId == null){
            if(categoryId != null){
                return getAllProducts().stream()
                        .filter(p -> p.getCategoryId().equals(categoryId))
                        .collect(Collectors.toList());
            }
            return getAllProducts();
        }
        Optional<Seller> seller = sellerRepository.findById(sellerId);
        if(seller.isPresent()){
            List<Product> productList = seller.get().getProducts();
            if(productList == null){
                return null;
            }
            if(categoryId != null){
                productList = productList.stream()
                        .filter(p -> p.getCategoryId().equals(categoryId))
                        .collect(Collectors.toList());
            }
            List<ProductDTO> res = new ArrayList<>();
            for(Product pr: productList){
                res.add(new ModelMapper().map(pr, ProductDTO.class));
            }
            return res;

        }
        return null;
    }

    /**
     * Get product by productId
     * @param productId
     * @return
     */
    public Product getProduct(Long productId) {
        Optional<Product> product = productRepository.findById(productId);
//        return product.map(value -> new ModelMapper().map(value, ProductDTO.class)).orElse(null);
        return product.orElse(null);
    }

    /**
     * Update product details.
     * @param productDTO
     * @return
     */
    public ProductDTO updateProduct(ProductDTO productDTO){
        Optional<Product> product = productRepository.findById(productDTO.getProductId());
        if(product.isEmpty()){
            return null;
        }
        productRepository.save(new ModelMapper().map(productDTO, Product.class));
        return productDTO;
    }

    /**
     * Delete product
     * @param productId
     * @return
     */
    public ProductDTO deleteProduct(Long productId) {
        Product product = productRepository.findProductByProductId(productId);
        System.out.println("Product --> " + product);
        if(product == null){
            return null;
        }
        ProductDTO productDTO = new ModelMapper().map(product, ProductDTO.class);
        productRepository.delete(product);
        return productDTO;
    }

    /**
     * Update rating of a product.
     * When the user gives a review and rating, this method is called
     * to update the rating of the product.
     * @param productId
     */
    public void updateRating(Long productId, Double rating){
        Product product = productRepository.findProductByProductId(productId);
        if(product != null){
            product.setRating(rating);
            productRepository.save(product);
        }
    }


    /**
     * Set product out of stock.
     * Can be used by seller only.
     * @param stock
     * @return
     */
    public ProductDTO setOutOfStock(ProductOutOfStock stock) {
        Product product = productRepository.findProductByProductId(stock.getProductId());
        if(product == null || !product.getSellerId().equals(stock.getSellerId())){
            return null;
        }
        product.setAvailable(stock.isAvailable());
        product.setProductQuantity(0L);
        return new ModelMapper().map(productRepository.save(product), ProductDTO.class);
    }

    public List<ProductDTO> getProductListById(List<Long> productIds) {
        List<Product> products = new ArrayList<>();
        for(Long id: productIds) {
            products.add(productRepository.findProductByProductId(id));
        }
        return products.stream()
                .map(p -> new ModelMapper().map(p, ProductDTO.class))
                .collect(Collectors.toList());
    }

    public Product updateProductQuantity(Long productId, Long productQuantity) {
        Product product = productRepository.findProductByProductId(productId);
        if(product != null) {
            product.setProductQuantity(productQuantity);
            return productRepository.save(product);
        }
        return null;
    }
}
