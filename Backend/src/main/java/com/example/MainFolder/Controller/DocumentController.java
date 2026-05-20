package com.example.MainFolder.Controller;

import com.example.MainFolder.Entity.DocumentEntity;
import com.example.MainFolder.Entity.UserEntity;
import com.example.MainFolder.Repository.DocumentRepository;
import com.example.MainFolder.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final String UPLOAD_DIR = "uploads/documents/";

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    // Helper to ensure upload folder exists
    private void ensureDirExists() {
        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    // 1. Get all issued documents (Admin review)
    @GetMapping
    public ResponseEntity<List<DocumentEntity>> getAllDocuments() {
        List<DocumentEntity> list = documentRepository.findAllByOrderByIssuedDateDesc();
        return ResponseEntity.ok(list);
    }

    // 2. Get my visible documents (Candidate view)
    @GetMapping("/my-vault")
    public ResponseEntity<?> getMyVault(@RequestParam Long candidateId) {
        List<DocumentEntity> list = documentRepository.findByRecipientIdAndStatusOrderByIssuedDateDesc(candidateId, "ISSUED");
        return ResponseEntity.ok(list);
    }

    // 3. Generate and send official letter (Rich text editor)
    @PostMapping
    public ResponseEntity<?> createLetter(@RequestBody Map<String, String> payload) {
        try {
            Long recipientId = Long.parseLong(payload.get("recipientId"));
            String type = payload.get("type");
            String contentBody = payload.get("content");

            Optional<UserEntity> userOpt = userRepository.findById(recipientId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Recipient candidate not found");
            }

            UserEntity user = userOpt.get();

            DocumentEntity doc = new DocumentEntity();
            doc.setRecipientId(user.getId());
            doc.setRecipientName(user.getUsername());
            doc.setType(type);
            doc.setIssuedDate(LocalDate.now());
            doc.setContentBody(contentBody);
            doc.setIsUpload(false);
            doc.setStatus("ISSUED");

            DocumentEntity saved = documentRepository.save(doc);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // 4. Upload a custom document (PDF)
    @PostMapping("/upload")
    public ResponseEntity<?> uploadCustomDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("recipientId") Long recipientId,
            @RequestParam("type") String type) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        Optional<UserEntity> userOpt = userRepository.findById(recipientId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Recipient candidate not found");
        }

        UserEntity user = userOpt.get();
        ensureDirExists();

        try {
            String originalName = file.getOriginalFilename();
            String uniqueName = System.currentTimeMillis() + "_" + originalName;
            Path filePath = Paths.get(UPLOAD_DIR, uniqueName);
            Files.write(filePath, file.getBytes());

            // Format file size
            long bytes = file.getSize();
            String sizeStr;
            if (bytes < 1024) sizeStr = bytes + " B";
            else if (bytes < 1024 * 1024) sizeStr = String.format("%.1f KB", bytes / 1024.0);
            else sizeStr = String.format("%.1f MB", bytes / (1024.0 * 1024.0));

            DocumentEntity doc = new DocumentEntity();
            doc.setRecipientId(user.getId());
            doc.setRecipientName(user.getUsername());
            doc.setType(type);
            doc.setIssuedDate(LocalDate.now());
            doc.setIsUpload(true);
            doc.setFileName(originalName);
            doc.setFileSize(sizeStr);
            doc.setFilePath(filePath.toString());
            doc.setStatus("ISSUED");

            DocumentEntity saved = documentRepository.save(doc);
            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload file: " + e.getMessage());
        }
    }

    // 5. Download custom document binary
    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadDocument(@PathVariable Long id) {
        Optional<DocumentEntity> docOpt = documentRepository.findById(id);
        if (docOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        DocumentEntity doc = docOpt.get();
        if (!doc.getIsUpload() || doc.getFilePath() == null) {
            return ResponseEntity.badRequest().body("This document does not contain an uploaded binary file.");
        }

        try {
            Path file = Paths.get(doc.getFilePath());
            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(file);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFileName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error downloading file: " + e.getMessage());
        }
    }

    // 6. Suspend / Restore visibility
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateVisibilityStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<DocumentEntity> docOpt = documentRepository.findById(id);
        if (docOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String newStatus = payload.get("status");
        if (newStatus == null) {
            return ResponseEntity.badRequest().body("Status is required");
        }

        DocumentEntity doc = docOpt.get();
        doc.setStatus(newStatus);
        DocumentEntity updated = documentRepository.save(doc);

        return ResponseEntity.ok(updated);
    }
}
