package com.campusconnect.backend.repository;

import com.campusconnect.backend.entity.Tutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface TutorRepository extends JpaRepository<Tutor, UUID> {
    // Spring Boot automatically writes the SQL for findAll(), save(), findById(), etc.
}