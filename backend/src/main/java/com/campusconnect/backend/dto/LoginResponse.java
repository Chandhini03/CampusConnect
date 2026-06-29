package com.campusconnect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private String name;
    private String email;
    private boolean isTutor;

    public LoginResponse(String token) {
        this.token = token;
    }

    public LoginResponse(String token, String name, String email, boolean isTutor) {
        this.token = token;
        this.name = name;
        this.email = email;
        this.isTutor = isTutor;
    }
}
