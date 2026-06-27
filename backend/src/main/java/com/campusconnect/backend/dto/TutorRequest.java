package com.campusconnect.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record TutorRequest(
    String branch,
    String yearOfStudy,
    String bio,
    List<String> subjects,
    BigDecimal hourlyRate
) {}