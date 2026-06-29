package com.campusconnect.backend.controller;

import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.dto.UserProfileRequest;
import com.campusconnect.backend.dto.UserProfileResponse;
import com.campusconnect.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.campusconnect.backend.dto.LoginRequest;
import com.campusconnect.backend.dto.LoginResponse;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String email = request.get("email");
            String password = request.get("password");

            //User registeredUser = authService.registerUser(name, email, password);
            User registeredUser =
        authService.registerUser(
                email,
                password,
                name
        );
            return ResponseEntity.ok(registeredUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            String jwt = authService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
            User user = authService.getUserByEmail(loginRequest.getEmail());
            return ResponseEntity.ok(new LoginResponse(jwt, user.getName(), user.getEmail(), user.isTutor()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getProfile(Principal principal) {
        return ResponseEntity.ok(authService.getProfile(principal.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @RequestBody UserProfileRequest request,
            Principal principal) {
        return ResponseEntity.ok(authService.updateProfile(principal.getName(), request));
    }

    @DeleteMapping("/me")
    public ResponseEntity<String> deleteProfile(Principal principal) {
        authService.deleteProfile(principal.getName());
        return ResponseEntity.ok("User profile deleted successfully.");
    }
}
