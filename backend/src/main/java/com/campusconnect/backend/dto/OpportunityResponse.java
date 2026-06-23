package com.campusconnect.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class OpportunityResponse {
    private Long id; // Or UUID depending on your primary key
    private String title;
    private String description;
    private String category;
    private String applicationLink;
    private LocalDateTime postedAt;
    
    // We flatten the user data so we don't accidentally send passwords!
    private String posterName; 
    private String posterEmail;
}