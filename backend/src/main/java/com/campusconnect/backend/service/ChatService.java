package com.campusconnect.backend.service;

import com.campusconnect.backend.dto.ChatMessage;
import com.campusconnect.backend.dto.ChatRoomResponse;
import com.campusconnect.backend.entity.ChatMessageEntity;
import com.campusconnect.backend.repository.ChatMessageRepository;
import com.campusconnect.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final Map<String, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>();

    public void join(String roomId, WebSocketSession session) {
        rooms.computeIfAbsent(roomId, key -> ConcurrentHashMap.newKeySet()).add(session);
    }

    public void leave(WebSocketSession session) {
        rooms.values().forEach(sessions -> sessions.remove(session));
    }

    public void saveAndSendToRoom(String roomId, String message) throws IOException {
        ChatMessage chatMessage = objectMapper.readValue(message, ChatMessage.class);
        ChatMessageEntity saved = saveMessage(roomId, chatMessage);
        sendToRoom(roomId, objectMapper.writeValueAsString(mapToMessage(saved)));
    }

    public List<ChatRoomResponse> getRoomsForUser(String userEmail) {
        Map<String, ChatRoomResponse> rooms = new LinkedHashMap<>();
        List<ChatMessageEntity> messages = chatMessageRepository
                .findBySenderEmailOrReceiverEmailOrderByCreatedAtDesc(userEmail, userEmail);

        for (ChatMessageEntity message : messages) {
            if (rooms.containsKey(message.getRoomId())) {
                continue;
            }
            String otherEmail = message.getSenderEmail().equals(userEmail)
                    ? message.getReceiverEmail()
                    : message.getSenderEmail();
            String otherName = userRepository.findByEmail(otherEmail)
                    .map(user -> user.getName())
                    .orElse(otherEmail);

            rooms.put(message.getRoomId(), new ChatRoomResponse(
                    message.getRoomId(),
                    otherName,
                    otherEmail,
                    message.getText()
            ));
        }

        return new ArrayList<>(rooms.values());
    }

    public List<ChatMessage> getMessages(String roomId, String userEmail) {
        if (!roomId.contains(userEmail)) {
            throw new IllegalArgumentException("You cannot view this chat");
        }

        return chatMessageRepository.findByRoomIdOrderByCreatedAtAsc(roomId)
                .stream()
                .map(this::mapToMessage)
                .toList();
    }

    private ChatMessageEntity saveMessage(String roomId, ChatMessage chatMessage) {
        ChatMessageEntity message = new ChatMessageEntity();
        message.setRoomId(roomId);
        message.setSender(chatMessage.sender());
        message.setSenderEmail(chatMessage.senderEmail());
        message.setReceiverEmail(chatMessage.receiverEmail());
        message.setText(chatMessage.text());
        message.setCreatedAt(LocalDateTime.now());
        return chatMessageRepository.save(message);
    }

    private ChatMessage mapToMessage(ChatMessageEntity message) {
        return new ChatMessage(
                message.getRoomId(),
                message.getSender(),
                message.getSenderEmail(),
                message.getReceiverEmail(),
                message.getCreatedAt().toString(),
                message.getText()
        );
    }

    private void sendToRoom(String roomId, String message) throws IOException {
        for (WebSocketSession session : rooms.getOrDefault(roomId, Set.of())) {
            if (session.isOpen()) {
                session.sendMessage(new TextMessage(message));
            }
        }
    }
}
