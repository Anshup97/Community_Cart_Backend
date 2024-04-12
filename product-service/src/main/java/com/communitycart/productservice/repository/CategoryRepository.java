package com.communitycart.productservice.repository;

import com.communitycart.productservice.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    public Category findByCategoryName(String categoryName);
    public Category findByCategoryId(Long categoryId);
    public Category deleteByCategoryId(Long categoryId);



}
