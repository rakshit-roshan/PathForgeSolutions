package com.example.MainFolder.Controller;

import com.example.MainFolder.Service.EmailNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/mail")
public class MailController {

    @Autowired
    private EmailNotificationService emailService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMail(@RequestBody Map<String, Object> body) {
        String to = (String) body.get("to");
        String subject = (String) body.get("subject");
        String message = (String) body.get("body"); // Frontend calls it 'body'
        
        if (to == null || subject == null || message == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "To, subject and body are required"));
        }

        try {
            emailService.sendSimpleEmail(to, subject, message);
            return ResponseEntity.ok(Map.of("message", "Email sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to send email: " + e.getMessage()));
        }
    }

    @PostMapping("/send-bulk")
    public ResponseEntity<?> sendBulk(@RequestBody Map<String, Object> body) {
        // Simple implementation: loop through recipients
        Object toObj = body.get("to");
        String subject = (String) body.get("subject");
        String message = (String) body.get("body");

        if (toObj instanceof java.util.List) {
            java.util.List<String> recipients = (java.util.List<String>) toObj;
            for (String recipient : recipients) {
                emailService.sendSimpleEmail(recipient, subject, message);
            }
            return ResponseEntity.ok(Map.of("message", "Bulk emails sent successfully"));
        }
        
        return ResponseEntity.badRequest().body(Map.of("error", "Recipients list is required"));
    }
}
