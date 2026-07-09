package com.campusconnect.backend.repository;

import com.campusconnect.backend.entity.TutorRating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TutorRatingRepository extends JpaRepository<TutorRating, UUID> {
    Optional<TutorRating> findByTutorIdAndRaterId(UUID tutorId, UUID raterId);
    List<TutorRating> findByTutorId(UUID tutorId);
    void deleteByTutorId(UUID tutorId);
}
