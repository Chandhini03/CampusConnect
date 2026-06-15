package com.campusconnect.backend.service;

import com.campusconnect.backend.entity.College;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.repository.CollegeRepository;
import com.campusconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.campusconnect.backend.config.JwtUtils;

@Service
@RequiredArgsConstructor // Lombok handles the constructor injection for repositories and the encoder
public class AuthService {

    private final UserRepository userRepository;
    private final CollegeRepository collegeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public User registerUser(String email, String rawPassword, String name) {
        // 1. Parse domain from email (e.g., alex@annauniv.edu -> annauniv.edu)
        String domain = email.substring(email.indexOf("@") + 1);

        
    //System.out.println("EMAIL = " + email);
    //System.out.println("DOMAIN = [" + domain + "]");
        // 2. Validate college domain exists (Tenant Lock)
        College college = collegeRepository.findByDomain(domain)
                .orElseThrow(() -> new IllegalArgumentException("Your college email domain is not registered on CampusConnect."));
    //System.out.println("FOUND COLLEGE = " + college.getName());

        // 3. Check if user already exists
        if (userRepository.existsByEmail(email)) {
            throw new IllegalStateException("Email already in use.");
        }

        // 4. Encrypt the password using BCrypt
        String encryptedPassword = passwordEncoder.encode(rawPassword);

        // 5. Build and save the user tied to their specific campus tenant
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(encryptedPassword); // Saved as a secure hash!
        newUser.setName(name);
        newUser.setCollege(college); 

        return userRepository.save(newUser);
    }
    public String loginUser(String email, String rawPassword) {
    // 1. Fetch user by email
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

    // 2. Verify password match (BCrypt handles matching raw text to the hash)
    if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
        throw new IllegalArgumentException("Invalid email or password.");
    }

    // 3. Generate and return the stateless JWT token packed with college_id
    return jwtUtils.generateToken(user);
}
}