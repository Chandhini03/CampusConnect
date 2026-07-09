package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.TutorRequest;
import com.campusconnect.backend.dto.TutorRatingRequest;
import com.campusconnect.backend.dto.TutorResponse;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.service.TutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tutors")
@RequiredArgsConstructor
public class TutorController {

    private final TutorService tutorService;

    @GetMapping
    public ResponseEntity<List<TutorResponse>> getAllTutors() {
        List<TutorResponse> tutors = tutorService.getAllTutors();
        return ResponseEntity.ok(tutors);
    }

    @PostMapping("/register")
public ResponseEntity<String> registerAsTutor(
        @RequestBody TutorRequest request,
        @AuthenticationPrincipal User loggedInUser) { // Spring gets the user automatically!
    
    tutorService.createTutorProfile(request, loggedInUser);
    return ResponseEntity.ok("Tutor profile created successfully!");
}

    @GetMapping("/me")
    public ResponseEntity<?> getMyTutorProfile(@AuthenticationPrincipal User loggedInUser) {
        try {
            return ResponseEntity.ok(tutorService.getMyTutorProfile(loggedInUser));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/me")
    public ResponseEntity<TutorResponse> updateMyTutorProfile(
            @RequestBody TutorRequest request,
            @AuthenticationPrincipal User loggedInUser) {
        return ResponseEntity.ok(tutorService.updateTutorProfile(request, loggedInUser));
    }

    @DeleteMapping("/me")
    public ResponseEntity<String> deleteMyTutorProfile(@AuthenticationPrincipal User loggedInUser) {
        tutorService.deleteTutorProfile(loggedInUser);
        return ResponseEntity.ok("Tutor profile deleted successfully.");
    }

    @PostMapping("/{id}/rating")
    public ResponseEntity<TutorResponse> rateTutor(
            @PathVariable UUID id,
            @RequestBody TutorRatingRequest request,
            @AuthenticationPrincipal User loggedInUser) {
        return ResponseEntity.ok(tutorService.rateTutor(id, request.rating(), loggedInUser));
    }
}
