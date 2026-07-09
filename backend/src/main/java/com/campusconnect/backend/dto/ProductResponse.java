package com.campusconnect.backend.dto;

import java.math.BigDecimal;

public record ProductResponse(
    String id,
    String title,
    String description,
    BigDecimal price,
    String imageUrl,
    boolean isAvailable,
    String sellerId,
    String sellerEmail,
    String sellerName
) {}
