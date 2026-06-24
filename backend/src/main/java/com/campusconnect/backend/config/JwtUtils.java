package com.campusconnect.backend.config;

import com.campusconnect.backend.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtils {

    // In production, move this to application.properties and use a 256-bit secure key!
    private final String JWT_SECRET = "your_super_secret_key_that_must_be_at_least_256_bits_long!"; 
    private final long JWT_EXPIRATION_MS = 86400000; // 24 Hours

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8));
    }

    // Generate token with custom college_id claim
    public String generateToken(User user) {
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("college_id", user.getCollege().getId()) // Tenant Lock Claim
                .claim("name", user.getName())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION_MS))
                .signWith(getSigningKey())
                .compact();
    }

    // Extract username from JWT
    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // Extract college_id for multi-tenant scoping
    public Long getCollegeIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.get("college_id", Long.class);
    }

    public boolean validateToken(String token) {
    try {
        Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token);
        return true;
    } catch (Exception e) {
        // Silently fail for malformed/expired tokens to keep telemetry clean
        return false;
        }
    }
}