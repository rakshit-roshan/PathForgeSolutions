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

    private String status = "ACTIVE"; // "ACTIVE", "COMPLETED", "ON_HOLD"
    
    private LocalDate joiningDate;
    
    private String internshipTrack;

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
