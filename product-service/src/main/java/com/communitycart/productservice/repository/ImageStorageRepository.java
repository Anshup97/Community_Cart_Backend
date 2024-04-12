package com.communitycart.productservice.repository;

import com.communitycart.productservice.entity.ImageData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImageStorageRepository extends JpaRepository<ImageData, Long> {

    Optional<ImageData> findByName(String fileName);

}
