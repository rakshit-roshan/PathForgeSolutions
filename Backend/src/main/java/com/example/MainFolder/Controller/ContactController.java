package com.example.MainFolder.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.MainFolder.Service.ContactService;
import com.example.MainFolder.Dto.ContactRequestDto;
import com.example.MainFolder.Entity.ContactEntity;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/main")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend to access the API
public class ContactController {
    
    @Autowired
    private ContactService contactService;
    
    // Submit a new contact inquiry
    @PostMapping("/contact")
    public ResponseEntity<String> submitContactInquiry(@RequestBody ContactRequestDto contactRequestDto) {
        try {
            String result = contactService.saveContactInquiry(contactRequestDto);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // Get all contact inquiries (for admin purposes)
    @GetMapping("/contact/all")
    public ResponseEntity<List<ContactEntity>> getAllContactInquiries() {
        try {
            List<ContactEntity> contacts = contactService.getAllContactInquiries();
            return ResponseEntity.ok(contacts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get contact inquiry by ID
    @GetMapping("/contact/{id}")
    public ResponseEntity<ContactEntity> getContactInquiryById(@PathVariable Long id) {
        try {
            Optional<ContactEntity> contact = contactService.getContactInquiryById(id);
            if (contact.isPresent()) {
                return ResponseEntity.ok(contact.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get contact inquiries by email
    @GetMapping("/contact/email/{email}")
    public ResponseEntity<List<ContactEntity>> getContactInquiriesByEmail(@PathVariable String email) {
        try {
            List<ContactEntity> contacts = contactService.getContactInquiriesByEmail(email);
            return ResponseEntity.ok(contacts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get contact inquiries by service type
    @GetMapping("/contact/service/{serviceType}")
    public ResponseEntity<List<ContactEntity>> getContactInquiriesByServiceType(@PathVariable String serviceType) {
        try {
            List<ContactEntity> contacts = contactService.getContactInquiriesByServiceType(serviceType);
            return ResponseEntity.ok(contacts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get contact inquiries by status
    @GetMapping("/contact/status/{status}")
    public ResponseEntity<List<ContactEntity>> getContactInquiriesByStatus(@PathVariable String status) {
        try {
            List<ContactEntity> contacts = contactService.getContactInquiriesByStatus(status);
            return ResponseEntity.ok(contacts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get recent contact inquiries
    @GetMapping("/contact/recent")
    public ResponseEntity<List<ContactEntity>> getRecentContactInquiries() {
        try {
            List<ContactEntity> contacts = contactService.getRecentContactInquiries();
            return ResponseEntity.ok(contacts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Update contact status
    @PutMapping("/contact/{id}/status")
    public ResponseEntity<String> updateContactStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            String result = contactService.updateContactStatus(id, status);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // Get contact statistics
    @GetMapping("/contact/statistics")
    public ResponseEntity<String> getContactStatistics() {
        try {
            String stats = contactService.getContactStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // Health check endpoint
    @GetMapping("/contact/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Contact API is working properly!");
    }
}
