package com.campusconnect.backend.dto;

import java.util.UUID;

public record UserProfileResponse(
    UUID id,
    String name,
    String email,
    boolean isTutor
) {}
