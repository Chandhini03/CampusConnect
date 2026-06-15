package com.campusconnect.backend.service;

import com.campusconnect.backend.entity.College;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.repository.CollegeRepository;
import com.campusconnect.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CollegeRepository collegeRepository;

    // Dependency Injection: Spring automatically passes the repositories here
    public AuthService(UserRepository userRepository, CollegeRepository collegeRepository) {
        this.userRepository = userRepository;
        this.collegeRepository = collegeRepository;
    }

    public User registerUser(String name, String email, String password) {
        // 1. Check if user already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email is already registered!");
        }

        
        if (!email.contains("@")) {
            throw new RuntimeException("Invalid email format!");
        }
        String domain = email.substring(email.indexOf("@") + 1);

        College college = collegeRepository.findByDomain(domain)
                .orElseThrow(() -> new RuntimeException("Your college domain (" + domain + ") is not registered on CampusConnect."));

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password); // Note: We will encrypt this later when we configure full Spring Security!
        user.setCollege(college);

        // 5. Save the user to the database
        return userRepository.save(user);
    }
}