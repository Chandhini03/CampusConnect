package com.campusconnect.backend.repository;

import com.campusconnect.backend.entity.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, UUID> {
    List<ChatMessageEntity> findByRoomIdOrderByCreatedAtAsc(String roomId);
    List<ChatMessageEntity> findBySenderEmailOrReceiverEmailOrderByCreatedAtDesc(String senderEmail, String receiverEmail);
}
