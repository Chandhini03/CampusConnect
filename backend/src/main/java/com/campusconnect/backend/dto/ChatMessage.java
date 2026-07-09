package com.campusconnect.backend.dto;

public record ChatMessage(
    String roomId,
    String sender,
    String senderEmail,
    String receiverEmail,
    String createdAt,
    String text
) {}
