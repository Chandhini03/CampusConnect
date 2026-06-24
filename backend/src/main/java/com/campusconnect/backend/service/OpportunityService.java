package com.campusconnect.backend.service;

import com.campusconnect.backend.entity.Opportunity;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.repository.OpportunityRepository;
import com.campusconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;
    private final UserRepository userRepository;

    // 1. Create a new opportunity
    public Opportunity createOpportunity(String email, String title, String description, String category, String applicationLink) {
        
        // Find the user making the request
        User poster = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Opportunity opportunity = new Opportunity();
        opportunity.setTitle(title);
        opportunity.setDescription(description);
        opportunity.setCategory(category);
        opportunity.setApplicationLink(applicationLink);
        opportunity.setPoster(poster);
        
        // TENANT LOCK: Automatically tie the post to the user's campus
        opportunity.setCollege(poster.getCollege()); 

        return opportunityRepository.save(opportunity);
    }

    // 2. Fetch all opportunities for a specific campus
    public List<Opportunity> getCampusOpportunities(java.util.UUID collegeId) {
        return opportunityRepository.findByCollegeIdOrderByPostedAtDesc(collegeId);
    }
    // 3. Update an existing opportunity (Only if the user owns it)
    public Opportunity updateOpportunity(UUID opportunityId, String loggedInEmail, String title, String description, String category, String applicationLink) {
        
        // Find the opportunity in the database
        Opportunity existingOpportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new IllegalArgumentException("Opportunity not found"));

        // OWNERSHIP CHECK: Does the logged-in user's email match the poster's email?
        if (!existingOpportunity.getPoster().getEmail().equals(loggedInEmail)) {
            throw new SecurityException("You do not have permission to edit this post.");
        }

        // If it matches, update the fields
        existingOpportunity.setTitle(title);
        existingOpportunity.setDescription(description);
        existingOpportunity.setCategory(category);
        existingOpportunity.setApplicationLink(applicationLink);

        return opportunityRepository.save(existingOpportunity);
    }

    // 4. Delete an opportunity (Only if the user owns it)
    public void deleteOpportunity(UUID opportunityId, String loggedInEmail) {
        
        Opportunity existingOpportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new IllegalArgumentException("Opportunity not found"));

        // OWNERSHIP CHECK
        if (!existingOpportunity.getPoster().getEmail().equals(loggedInEmail)) {
            throw new SecurityException("You do not have permission to delete this post.");
        }

        opportunityRepository.delete(existingOpportunity);
    }
}