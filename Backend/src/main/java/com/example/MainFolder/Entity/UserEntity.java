package com.example.MainFolder.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name="user_details")
public class UserEntity {
    @Id 
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    
    @JsonProperty("name")
    private String username;

    @Column(nullable = false, unique=true)
    private String email;
    
    private String password;

    private String role = "CANDIDATE"; // "ADMIN" or "CANDIDATE"

    private String status = "PENDING"; // Default to PENDING for new signups

    private String employeeCode;
    
    private LocalDate joiningDate;
    
    private String internshipTrack;

    private String collegeName;

    @Column(length = 2000)
    private String bio;

    @Column(length = 1048576) // Support Base64 image
    private String profilePic;

    private Boolean twoFactorEnabled = false;

    private String twoFactorSecret;

    private LocalDateTime twoFactorExpiry;

    private Integer internshipDurationMonths = 3;

    private LocalDateTime lastConnected;

    private Boolean disabled = false;

    private String resetToken;
    
    private LocalDateTime resetTokenExpiry;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
