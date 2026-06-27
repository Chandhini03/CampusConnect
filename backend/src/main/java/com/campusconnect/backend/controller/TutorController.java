package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.TutorRequest;
import com.campusconnect.backend.dto.TutorResponse;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.service.TutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}