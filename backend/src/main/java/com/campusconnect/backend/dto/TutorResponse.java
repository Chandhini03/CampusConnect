package com.campusconnect.backend.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record TutorResponse(
    UUID id,
    UUID tutorUserId,
    String tutorEmail,
    String tutorName,
    String branch,
    String yearOfStudy,
    String bio, 
    List<String> subjects,
    BigDecimal hourlyRate,
    Double rating,
    boolean isAvailable
) {}
