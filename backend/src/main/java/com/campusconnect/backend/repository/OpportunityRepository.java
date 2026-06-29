package com.campusconnect.backend.repository;

import com.campusconnect.backend.entity.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, UUID> {
    
    // This query ensures students only see opportunities posted at their own college
    List<Opportunity> findByCollegeIdOrderByPostedAtDesc(UUID collegeId);
    
    // Optional: Let the frontend filter by category within their college
    List<Opportunity> findByCollegeIdAndCategoryOrderByPostedAtDesc(UUID collegeId, String category);

    void deleteByPosterId(UUID posterId);
}
