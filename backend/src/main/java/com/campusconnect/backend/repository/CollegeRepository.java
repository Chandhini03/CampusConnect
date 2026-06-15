package com.campusconnect.backend.repository;

import com.campusconnect.backend.entity.College;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface CollegeRepository extends JpaRepository<College, UUID> {
    
    Optional<College> findByDomain(String domain);
}