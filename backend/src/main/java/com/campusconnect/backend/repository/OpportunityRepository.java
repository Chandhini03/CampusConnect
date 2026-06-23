package com.campusconnect.backend.repository;

import com.campusconnect.backend.entity.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

import java.util.List;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {
    
    // This query ensures students only see opportunities posted at their own college
    List<Opportunity> findByCollegeIdOrderByPostedAtDesc(java.util.UUID collegeId);
    
    // Optional: Let the frontend filter by category within their college
    List<Opportunity> findByCollegeIdAndCategoryOrderByPostedAtDesc(java.util.UUID collegeId, String category);
}