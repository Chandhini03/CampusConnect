package com.campusconnect.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "is_tutor", nullable = false)
    private boolean isTutor = false;

    @ManyToOne
    @JoinColumn(name = "college_id", nullable = false)
    private College college;
}