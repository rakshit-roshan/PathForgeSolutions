package com.example.MainFolder.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name="daily_logs")
public class DailyLogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long candidateId; // Reference to UserEntity.id

    @Column(nullable = false)
    private LocalDate logDate;

    @Column(nullable = false, length = 1000)
    private String tasksDone;

    @Column(nullable = false)
    private Double hoursWorked;

    @Column(length = 1000)
    private String challenges;

    @Column(length = 500)
    private String planTomorrow;

    private String mood; // "GREAT", "GOOD", "NEUTRAL", "DIFFICULT"

    private String tools = ""; // Comma-separated list of tools utilized

    private String status = "PENDING"; // "PENDING", "APPROVED", "REVISION"

    @Column(length = 1000)
    private String revisionNote;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
