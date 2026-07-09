package com.campusconnect.backend.service;

import com.campusconnect.backend.dto.TutorRequest;
import com.campusconnect.backend.dto.TutorResponse;
import com.campusconnect.backend.entity.TutorRating;
import com.campusconnect.backend.entity.Tutor;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.repository.TutorRatingRepository;
import com.campusconnect.backend.repository.TutorRepository;
import com.campusconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TutorService {

    private final TutorRepository tutorRepository;
    private final TutorRatingRepository tutorRatingRepository;
    private final UserRepository userRepository;

    // 1. Create a new Tutor profile linked to a logged-in User
    @Transactional
    public void createTutorProfile(TutorRequest request, User loggedInUser) {
        Tutor tutor = tutorRepository.findByUserEmail(loggedInUser.getEmail()).orElse(new Tutor());
        
        // Linking the entity to the user object (The most important part!)
        tutor.setUser(loggedInUser);
        
        // Setting fields from the request
        tutor.setBranch(request.branch());
        tutor.setYearOfStudy(request.yearOfStudy());
        tutor.setBio(request.bio());
        tutor.setSubjects(request.subjects());
        tutor.setHourlyRate(request.hourlyRate());
        
        // Default values
        tutor.setRating(5.0);
        tutor.setAvailable(true);
        loggedInUser.setTutor(true);
        
        tutorRepository.save(tutor);
        userRepository.save(loggedInUser);
    }

    public TutorResponse getMyTutorProfile(User loggedInUser) {
        return tutorRepository.findByUserEmail(loggedInUser.getEmail())
                .map(this::mapToResponse)
                .orElseThrow(() -> new IllegalArgumentException("Tutor profile not found"));
    }

    @Transactional
    public TutorResponse updateTutorProfile(TutorRequest request, User loggedInUser) {
        createTutorProfile(request, loggedInUser);
        return getMyTutorProfile(loggedInUser);
    }

    @Transactional
    public void deleteTutorProfile(User loggedInUser) {
        tutorRepository.findByUserEmail(loggedInUser.getEmail())
                .ifPresent(tutor -> tutorRatingRepository.deleteByTutorId(tutor.getId()));
        tutorRepository.deleteByUserId(loggedInUser.getId());
        loggedInUser.setTutor(false);
        userRepository.save(loggedInUser);
    }

    @Transactional
    public TutorResponse rateTutor(UUID tutorId, int rating, User loggedInUser) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Tutor tutor = tutorRepository.findById(tutorId)
                .orElseThrow(() -> new IllegalArgumentException("Tutor profile not found"));

        if (tutor.getUser().getId().equals(loggedInUser.getId())) {
            throw new IllegalArgumentException("You cannot rate yourself");
        }

        TutorRating tutorRating = tutorRatingRepository
                .findByTutorIdAndRaterId(tutorId, loggedInUser.getId())
                .orElse(new TutorRating());
        tutorRating.setTutor(tutor);
        tutorRating.setRater(loggedInUser);
        tutorRating.setRating(rating);
        tutorRatingRepository.save(tutorRating);

        List<TutorRating> ratings = tutorRatingRepository.findByTutorId(tutorId);
        double average = ratings.stream()
                .mapToInt(TutorRating::getRating)
                .average()
                .orElse(5.0);
        tutor.setRating(Math.round(average * 10.0) / 10.0);

        return mapToResponse(tutorRepository.save(tutor));
    }

    // 2. Fetch all tutors for the UI
    public List<TutorResponse> getAllTutors() {
        return tutorRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Helper to map entity to DTO
    private TutorResponse mapToResponse(Tutor tutor) {
        return new TutorResponse(
                tutor.getId(),
                tutor.getUser().getId(),
                tutor.getUser().getEmail(),
                tutor.getUser().getName(),
                tutor.getBranch(),
                tutor.getYearOfStudy(),
                tutor.getBio(),
                tutor.getSubjects(),
                tutor.getHourlyRate(),
                tutor.getRating(),
                tutor.isAvailable()
        );
    }
}
