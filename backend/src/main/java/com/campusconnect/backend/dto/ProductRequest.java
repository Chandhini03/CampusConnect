package com.campusconnect.backend.dto;

import java.math.BigDecimal;

public record ProductRequest(
    String title,
    String description,
    BigDecimal price,
    String imageUrl,
    boolean isAvailable
) {}