package com.campusconnect.backend.dto;

public record ChatRoomResponse(
    String roomId,
    String otherName,
    String otherEmail,
    String lastMessage
) {}
