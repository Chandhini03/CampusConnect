package com.campusconnect.backend.repository;

import com.campusconnect.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    
    // Core Feature: Fetch only available items belonging to a specific college
    List<Product> findByCollegeIdAndIsAvailableTrue(UUID collegeId);
    
    // Optional: Fetch all items listed by a specific student (for their "My Listings" page)
    List<Product> findBySellerId(UUID sellerId);

    void deleteBySellerId(UUID sellerId);
}
