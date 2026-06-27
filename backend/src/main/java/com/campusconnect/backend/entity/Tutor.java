package com.campusconnect.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tutors")
@Getter
@Setter
@NoArgsConstructor // Required by JPA!
public class Tutor {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String branch;

    @Column(nullable = false)
    private String yearOfStudy;

    @Column(length = 500)
    private String bio;

    @ElementCollection
    @CollectionTable(name = "tutor_subjects", joinColumns = @JoinColumn(name = "tutor_id"))
    @Column(name = "subject")
    private List<String> subjects;

    private BigDecimal hourlyRate;
    
    private Double rating = 5.0; 
    
    private boolean isAvailable = true;

    // Zero boilerplate! Lombok handles everything invisibly.
}