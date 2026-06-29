package com.campusconnect.backend.service;

import com.campusconnect.backend.entity.College;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.dto.UserProfileRequest;
import com.campusconnect.backend.dto.UserProfileResponse;
import com.campusconnect.backend.repository.CollegeRepository;
import com.campusconnect.backend.repository.OpportunityRepository;
import com.campusconnect.backend.repository.ProductRepository;
import com.campusconnect.backend.repository.TutorRepository;
import com.campusconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.campusconnect.backend.config.JwtUtils;

@Service
@RequiredArgsConstructor // Lombok handles the constructor injection for repositories and the encoder
public class AuthService {

    private final UserRepository userRepository;
    private final CollegeRepository collegeRepository;
    private final TutorRepository tutorRepository;
    private final ProductRepository productRepository;
    private final OpportunityRepository opportunityRepository;
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

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public UserProfileResponse getProfile(String email) {
        return mapToProfile(getUserByEmail(email));
    }

    public UserProfileResponse updateProfile(String email, UserProfileRequest request) {
        User user = getUserByEmail(email);
        user.setName(request.name());
        return mapToProfile(userRepository.save(user));
    }

    @Transactional
    public void deleteProfile(String email) {
        User user = getUserByEmail(email);
        tutorRepository.deleteByUserId(user.getId());
        productRepository.deleteBySellerId(user.getId());
        opportunityRepository.deleteByPosterId(user.getId());
        userRepository.delete(user);
    }

    private UserProfileResponse mapToProfile(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.isTutor()
        );
    }
}
