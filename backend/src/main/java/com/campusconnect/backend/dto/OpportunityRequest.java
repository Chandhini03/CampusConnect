package com.campusconnect.backend.dto;

import lombok.Data;

@Data
public class OpportunityRequest {
    private String title;
    private String description;
    private String category;
    private String applicationLink;
}