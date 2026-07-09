package com.campusconnect.backend.config;

import com.campusconnect.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Component
@RequiredArgsConstructor
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ChatService chatService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        chatService.join(roomId(session), session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        chatService.saveAndSendToRoom(roomId(session), message.getPayload());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        chatService.leave(session);
    }

    private String roomId(WebSocketSession session) {
        URI uri = session.getUri();
        if (uri == null) {
            return "general";
        }
        String roomId = UriComponentsBuilder.fromUri(uri).build().getQueryParams().getFirst("roomId");
        return roomId == null || roomId.isBlank() ? "general" : roomId;
    }
}
