package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.ChatMessage;
import com.campusconnect.backend.dto.ChatRoomResponse;
import com.campusconnect.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping
    public ResponseEntity<List<ChatRoomResponse>> getMyChats(Principal principal) {
        return ResponseEntity.ok(chatService.getRoomsForUser(principal.getName()));
    }

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<ChatMessage>> getMessages(@PathVariable String roomId, Principal principal) {
        return ResponseEntity.ok(chatService.getMessages(roomId, principal.getName()));
    }
}
