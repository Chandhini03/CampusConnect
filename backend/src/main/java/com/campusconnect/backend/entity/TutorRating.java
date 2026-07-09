package com.campusconnect.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(
        name = "tutor_ratings",
        uniqueConstraints = @UniqueConstraint(columnNames = {"tutor_id", "rater_id"})
)
@Getter
@Setter
@NoArgsConstructor
public class TutorRating {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "tutor_id", nullable = false)
    private Tutor tutor;

    @ManyToOne(optional = false)
    @JoinColumn(name = "rater_id", nullable = false)
    private User rater;

    @Column(nullable = false)
    private int rating;
}
