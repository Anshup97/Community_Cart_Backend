package com.communitycart.productservice.Controllers;

import com.communitycart.productservice.dtos.CategoryDTO;
import com.communitycart.productservice.entity.Category;
import com.communitycart.productservice.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * API for managing categories of products.
 * Users with 'SELLER' role only are authorized to access these endpoints.
 * User role is checked from JWT token passed in authorization header
 * while sending the request.
 */
@RestController
//@CrossOrigin("*")
@RequestMapping("/category")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    /**
     * Seller can add a category.
     * If seller wants to add an existing category, then it will return null
     * else the new category will be added. The Category added can be used by other sellers
     * also. No duplicate categories allowed.
     * @param categoryDTO
     * @return
     */
    @PostMapping("/addCategory")
    public ResponseEntity<CategoryDTO> addCategory(@RequestBody CategoryDTO categoryDTO){
        CategoryDTO category = categoryService.addCategory(categoryDTO);
        if(category == null){
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(category, HttpStatus.CREATED);
    }

    /**
     * Delete a category.
     * @param categoryId
     * @return
     */
    @DeleteMapping("/deleteCategory")
    @Transactional
    public ResponseEntity<?> deleteCategory(@RequestParam Long categoryId){
        CategoryDTO category = categoryService.deleteCategory(categoryId);
        if(category == null){
            return new ResponseEntity<>(null, HttpStatus.OK);
        }
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    /**
     * Update category details like name, description and category icon.
     * @param categoryDTO
     * @return
     */
    @PutMapping("/updateCategory")
    public ResponseEntity<?> updateCategory(@RequestBody CategoryDTO categoryDTO){
        CategoryDTO category = categoryService.updateCategory(categoryDTO);
        if(category == null){
            return new ResponseEntity<>(null, HttpStatus.OK);
        }
        return new ResponseEntity<>(category, HttpStatus.OK);
    }


    /**
     * Get list of all categories.
     * @return
     */
    @GetMapping("/getAllCategories")
    public ResponseEntity<List<Category>> getCategories(){
        return new ResponseEntity<>(categoryService.getCategories(), HttpStatus.OK);
    }

    /**
     * Get category by categoryId.
     * @param categoryId
     * @return
     */
    @GetMapping("/getCategoryById")
    public ResponseEntity<Category> getCategoryById(@RequestParam("categoryId") Long categoryId){
        Category category = categoryService.getCategoryById(categoryId);
        if(category != null){
            return new ResponseEntity<>(category, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.OK);
    }



}
