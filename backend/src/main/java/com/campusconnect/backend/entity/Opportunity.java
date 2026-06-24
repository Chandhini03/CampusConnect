package com.campusconnect.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "opportunities")
@Data
public class Opportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title; 
    
    @Column(length = 2000) 
    private String description;

    @Column(nullable = false)
    private String category; 

    private String applicationLink; 

    private LocalDateTime postedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poster_id", nullable = false)//joincolumn is the foreign key in the opportunities table that references the primary key of the users table. It establishes a relationship between the two tables, allowing us to associate each opportunity with the user who posted it.
    private User poster;

    @ManyToOne(fetch = FetchType.LAZY)
    //this fetch type is used to optimize performance by loading the related college data only when it's explicitly accessed, rather than loading it immediately with the opportunity. This can help reduce unnecessary database queries and improve efficiency, especially when dealing with large datasets.
    @JoinColumn(name = "college_id", nullable = false)
    private College college;
}