package com.communitycart.orderservice.service;

import com.communitycart.orderservice.client.ProductClient;
import com.communitycart.orderservice.dtos.ProductDTO;
import com.communitycart.orderservice.dtos.ViewBookMarkDTO;
import com.communitycart.orderservice.entity.BookMark;
import com.communitycart.orderservice.repository.BookMarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Bookmark service class to add, remove and view bookmarked products
 * of a user.
 */
@Service
public class BookMarkService {

    @Autowired
    private BookMarkRepository repository;

    @Autowired
    private ProductClient productClient;

    /**
     * Bookmark a product.
     * Product bookmarked by a customer is saved in the database.
     * @param customerId
     * @param productId
     * @return
     */
    public ViewBookMarkDTO addBookmark(Long customerId, Long productId) {
        if(repository.findBookMarkByCustomerIdAndProductId(customerId, productId) != null){
            return viewBookmarks(customerId);
        }
        BookMark bookMark = new BookMark();
        bookMark.setCustomerId(customerId);
        bookMark.setProductId(productId);
        repository.save(bookMark);
        return viewBookmarks(customerId);
    }

    /**
     * Get all the products bookmarked by a customer using customerId.
     * @param customerId
     * @return
     */
    public ViewBookMarkDTO viewBookmarks(Long customerId) {
        List<BookMark> bookMarks = repository.findByCustomerId(customerId);
        ViewBookMarkDTO bm = new ViewBookMarkDTO();
        List<Long> productIds = new ArrayList<>();
        for(BookMark b: bookMarks){
            Long id = b.getProductId();
            if(id != null) {
                productIds.add(id);
            }
        }
        List<ProductDTO> products = productClient.getProductListById(productIds);
        bm.setCustomerId(customerId);
        bm.setProducts(products);
        return bm;
    }

    /**
     * Remove bookmark.
     * @param customerId
     * @param productId
     * @return
     */
    public ViewBookMarkDTO removeBookmark(Long customerId, Long productId) {
        BookMark bookMark = repository.findBookMarkByCustomerIdAndProductId(customerId, productId);
        if(bookMark != null){
            repository.delete(bookMark);
        }
        return viewBookmarks(customerId);
    }
}
