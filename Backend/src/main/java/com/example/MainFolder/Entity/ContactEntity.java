package com.example.MainFolder.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name="contact_inquiries")
public class ContactEntity {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = false)
    private String serviceType;
    
    // Internship specific fields (optional)
    private String internshipTrack;
    private String duration;
    private String experienceLevel;
    private String customIdea;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @Column(nullable = false)
    private String preferredContactMethod;
    
    // Phone call scheduling fields (optional)
    private String preferredDate;
    private String preferredTime;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "status")
    private String status = "NEW"; // NEW, CONTACTED, CLOSED
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
