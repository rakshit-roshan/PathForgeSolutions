package com.example.MainFolder.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "documents")
public class DocumentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long recipientId; // Reference to UserEntity.id

    @Column(nullable = false)
    private String recipientName;

    @Column(nullable = false)
    private String type; // "Offer Letter", "Completion Certificate", "LOR", "Experience Letter", "NOC", "Custom"

    @Column(nullable = false)
    private LocalDate issuedDate;

    @Column(length = 5000)
    private String contentBody; // For editor generated letters

    private String filePath; // Path to download/access custom uploaded file
    private String fileName; // Original filename, e.g., "Offer_Letter.pdf"
    private String fileSize; // Formatted file size, e.g., "340 KB"

    @Column(nullable = false)
    private String status = "ISSUED"; // "ISSUED", "SUSPENDED"

    private Boolean isUpload = false; // True if uploaded from admin system

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
