package com.campusconnect.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Disable CSRF protection (required for testing POST requests via Postman)
            .csrf(csrf -> csrf.disable())
            
            // 2. Configure URL authorization rules
            .authorizeHttpRequests(auth -> auth
                // Allow absolutely anyone to hit the registration endpoint
                .requestMatchers("/api/auth/register").permitAll()
                // Any other URL request must be authenticated
                .anyRequest().authenticated()
            );

        return http.build();
    }
}