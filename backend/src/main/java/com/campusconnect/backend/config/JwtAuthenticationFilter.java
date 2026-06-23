package com.campusconnect.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // 1. If there's no token, just move on (SecurityConfig will block them anyway)
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        // 2. Cut off the "Bearer " part to get the pure token string
        String token = header.substring(7);
        
        // ADD THESE PRINT STATEMENTS TO DEBUG:
        System.out.println("Received Token: " + token);
        boolean isValid = jwtUtils.validateToken(token);
        System.out.println("Is Token Valid? " + isValid);

        
        // 3. If the token is valid, tell Spring Security this user is officially logged in!
        if (jwtUtils.validateToken(token)) {
            String email = jwtUtils.getEmailFromToken(token);
            
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        // 4. Continue to the next step
        chain.doFilter(request, response);
    }
}