package com.example.MainFolder.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.MainFolder.Service.ContactService;
import com.example.MainFolder.Dto.ContactRequestDto;
import com.example.MainFolder.Entity.ContactEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/main")
// CORS is handled globally in SecurityConfig - no need for @CrossOrigin here
public class ContactController {
    
    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);
    
    @Autowired
    private ContactService contactService;
    
    // Submit a new contact inquiry
    @PostMapping("/contact")
    public ResponseEntity<String> submitContactInquiry(@RequestBody ContactRequestDto contactRequestDto) {
        // DEBUG: System.out always works - use to verify code execution
        logger.info("ContactController: Received POST request to /main/contact");
        logger.debug("ContactController: Request data - Email: {}, Name: {}", 
                     contactRequestDto.getEmail(), contactRequestDto.getName());
        
        try {
            String result = contactService.saveContactInquiry(contactRequestDto);
            System.out.println("========== SUCCESS: " + result + " ==========");
            logger.info("ContactController: Successfully processed contact inquiry");
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            System.out.println("========== VALIDATION ERROR: " + e.getMessage() + " ==========");
            logger.warn("ContactController: Validation error - {}", e.getMessage());
            // Validation errors - return 400 Bad Request
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("========== EXCEPTION: " + e.getMessage() + " ==========");
            e.printStackTrace(); // Print full stack trace
            logger.error("ContactController: Error processing contact inquiry", e);
            // Other errors - return 500 Internal Server Error
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
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
        System.out.println("========== HEALTH CHECK CALLED ==========");
        logger.info("Health check endpoint called");
        return ResponseEntity.ok("Contact API is working properly!");
    }
    
    // Debug test endpoint - to verify logging works
    @GetMapping("/contact/test-debug")
    public ResponseEntity<String> testDebug() {
        System.out.println("========== DEBUG TEST ENDPOINT CALLED ==========");
        System.out.println("Current Time: " + new java.util.Date());
        logger.info("Test debug endpoint called");
        logger.debug("Debug level message from test endpoint");
        return ResponseEntity.ok("Debug test successful! Check console and logs/application.log");
    }
    
    // Email configuration test endpoint
    @GetMapping("/contact/test-email")
    public ResponseEntity<String> testEmail() {
        try {
            logger.info("Email test endpoint called");
            System.out.println("========== EMAIL TEST ENDPOINT CALLED ==========");
            
            // Create a test contact entity
            ContactEntity testContact = new ContactEntity();
            testContact.setId(999L);
            testContact.setName("Test User");
            testContact.setEmail("test@example.com");
            testContact.setPhone("1234567890");
            testContact.setServiceType("Test Service");
            testContact.setMessage("This is a test email to verify email configuration.");
            testContact.setPreferredContactMethod("Email");
            testContact.setCreatedAt(java.time.LocalDateTime.now());
            
            // Try to send test email
            contactService.testEmailNotification(testContact);
            
            return ResponseEntity.ok("Test email sent! Check your admin email inbox and application logs.");
        } catch (Exception e) {
            logger.error("Email test failed: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Email test failed: " + e.getMessage() + ". Check logs for details.");
        }
    }
}
