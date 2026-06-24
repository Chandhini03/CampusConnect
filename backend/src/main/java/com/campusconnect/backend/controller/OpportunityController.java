package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.OpportunityRequest;
import com.campusconnect.backend.dto.OpportunityResponse;
import com.campusconnect.backend.entity.Opportunity;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.repository.UserRepository;
import com.campusconnect.backend.service.OpportunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/opportunities")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OpportunityController {

    private final OpportunityService opportunityService;
    private final UserRepository userRepository; 

    // --- POST: Create a new opportunity (SECURED WITH DTO) ---
    @PostMapping
    public ResponseEntity<?> createOpportunity(
            @RequestBody OpportunityRequest request, // Uses DTO to prevent malicious data injection
            Principal principal 
    ) {
        try {
            String loggedInEmail = principal.getName();
            Opportunity created = opportunityService.createOpportunity(
                    loggedInEmail,
                    request.getTitle(),
                    request.getDescription(),
                    request.getCategory(),
                    request.getApplicationLink()
            );
            
            // Return safe data
            return ResponseEntity.ok(mapToResponseDTO(created));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // --- GET: Fetch all opportunities for the logged-in user's campus (SECURED WITH DTO) ---
    @GetMapping
    public ResponseEntity<?> getCampusOpportunities(Principal principal) {
        try {
            String loggedInEmail = principal.getName();
            
            User currentUser = userRepository.findByEmail(loggedInEmail)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            
            UUID collegeId = currentUser.getCollege().getId();
            
            // Fetch raw data, then map it to safe DTOs so passwords aren't leaked
            List<OpportunityResponse> safeFeed = opportunityService.getCampusOpportunities(collegeId)
                    .stream()
                    .map(this::mapToResponseDTO)
                    .collect(Collectors.toList());
                    
            return ResponseEntity.ok(safeFeed);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // --- PUT: Update an existing post (SECURED WITH DTO & UUID) ---
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOpportunity(
            @PathVariable UUID id, // FIXED: Changed Long to UUID
            @RequestBody OpportunityRequest request,
            Principal principal
    ) {
        try {
            String loggedInEmail = principal.getName(); 
            opportunityService.updateOpportunity(
                    id, 
                    loggedInEmail, 
                    request.getTitle(), 
                    request.getDescription(), 
                    request.getCategory(), 
                    request.getApplicationLink()
            );
            return ResponseEntity.ok("Opportunity updated successfully");
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage()); 
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // --- DELETE: Remove a post (SECURED WITH UUID) ---
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOpportunity(
            @PathVariable UUID id, // FIXED: Changed Long to UUID
            Principal principal
    ) {
        try {
            String loggedInEmail = principal.getName();
            opportunityService.deleteOpportunity(id, loggedInEmail);
            return ResponseEntity.ok("Opportunity successfully deleted.");
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage()); 
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // --- HELPER METHOD: Converts raw database entity to safe JSON response ---
    private OpportunityResponse mapToResponseDTO(Opportunity opportunity) {
        OpportunityResponse dto = new OpportunityResponse();
        dto.setId(opportunity.getId());
        dto.setTitle(opportunity.getTitle());
        dto.setDescription(opportunity.getDescription());
        dto.setCategory(opportunity.getCategory());
        dto.setApplicationLink(opportunity.getApplicationLink());
        dto.setPostedAt(opportunity.getPostedAt());
        
        // Flattens the poster data to completely hide the password and raw college entity
        if (opportunity.getPoster() != null) {
            dto.setPosterName(opportunity.getPoster().getName());
            dto.setPosterEmail(opportunity.getPoster().getEmail());
        }
        
        return dto;
    }
}