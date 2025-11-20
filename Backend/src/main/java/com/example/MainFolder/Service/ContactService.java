package com.example.MainFolder.Service;

import com.example.MainFolder.Entity.ContactEntity;
import com.example.MainFolder.Dto.ContactRequestDto;
import com.example.MainFolder.Repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ContactService {
    
    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);
    
    @Autowired
    private ContactRepository contactRepository;
    
    // Save a new contact inquiry
    @Transactional
    public String saveContactInquiry(ContactRequestDto contactRequestDto) {
        // DEBUG: System.out always works - use to verify code execution
        System.out.println("========== CONTACT SERVICE CALLED ==========");
        System.out.println("Email: " + (contactRequestDto != null ? contactRequestDto.getEmail() : "NULL"));
        
        try {
            logger.info("Received contact inquiry request for email: {}", contactRequestDto.getEmail());
            System.out.println("[LOGGER] INFO: Received contact inquiry request");
            
            // Validate the request
            if (!contactRequestDto.isValid()) {
                System.out.println("[LOGGER] WARN: Invalid contact request data");
                logger.warn("Invalid contact request data received");
                throw new IllegalArgumentException("Invalid request data. Please fill all required fields.");
            }
            
            System.out.println("[SERVICE] Validation passed - creating entity");
            
            // Create new contact entity
            ContactEntity contactEntity = new ContactEntity();
            contactEntity.setName(contactRequestDto.getName().trim());
            contactEntity.setEmail(contactRequestDto.getEmail().trim());
            contactEntity.setPhone(contactRequestDto.getPhone().trim());
            contactEntity.setServiceType(contactRequestDto.getServiceType().trim());
            contactEntity.setMessage(contactRequestDto.getMessage().trim());
            contactEntity.setPreferredContactMethod(contactRequestDto.getPreferredContactMethod().trim());
            
            // Set internship specific fields if available
            if (contactRequestDto.getInternshipTrack() != null) {
                contactEntity.setInternshipTrack(contactRequestDto.getInternshipTrack().trim());
            }
            if (contactRequestDto.getDuration() != null) {
                contactEntity.setDuration(contactRequestDto.getDuration().trim());
            }
            if (contactRequestDto.getExperienceLevel() != null) {
                contactEntity.setExperienceLevel(contactRequestDto.getExperienceLevel().trim());
            }
            if (contactRequestDto.getCustomIdea() != null) {
                contactEntity.setCustomIdea(contactRequestDto.getCustomIdea().trim());
            }
            
            // Set phone call scheduling fields if available
            if (contactRequestDto.getPreferredDate() != null) {
                contactEntity.setPreferredDate(contactRequestDto.getPreferredDate().trim());
            }
            if (contactRequestDto.getPreferredTime() != null) {
                contactEntity.setPreferredTime(contactRequestDto.getPreferredTime().trim());
            }
            
            // Save to database
            System.out.println("[SERVICE] Attempting to save to database...");
            logger.debug("Attempting to save contact entity to database");
            ContactEntity savedContact = contactRepository.save(contactEntity);
            System.out.println("[SERVICE] Saved with ID: " + savedContact.getId());
            logger.info("Contact inquiry saved successfully with ID: {}", savedContact.getId());
            
            // Verify the save by checking if ID is generated
            if (savedContact.getId() == null) {
                System.out.println("[ERROR] ID is NULL after save!");
                logger.error("Contact entity saved but ID is null - possible database issue");
                throw new RuntimeException("Failed to save contact inquiry - ID not generated");
            }
            
            String successMsg = "Contact inquiry submitted successfully! Your inquiry ID is: " + savedContact.getId() + 
                   ". We will contact you within 24 hours using your preferred method: " + 
                   contactRequestDto.getPreferredContactMethod();
            System.out.println("[SERVICE] SUCCESS: " + successMsg);
            return successMsg;
                   
        } catch (IllegalArgumentException e) {
            System.out.println("[LOGGER] ERROR: Validation error - " + e.getMessage());
            logger.error("Validation error: {}", e.getMessage());
            throw e; // Re-throw validation errors
        } catch (Exception e) {
            System.out.println("[LOGGER] ERROR: Exception - " + e.getMessage());
            e.printStackTrace(); // Print full stack trace
            logger.error("Error saving contact inquiry: {}", e.getMessage(), e);
            throw new RuntimeException("Error saving contact inquiry: " + e.getMessage(), e);
        }
    }
    
    // Get all contact inquiries
    public List<ContactEntity> getAllContactInquiries() {
        return contactRepository.findAll();
    }
    
    // Get contact inquiry by ID
    public Optional<ContactEntity> getContactInquiryById(Long id) {
        return contactRepository.findById(id);
    }
    
    // Get contact inquiries by email
    public List<ContactEntity> getContactInquiriesByEmail(String email) {
        return contactRepository.findByEmail(email);
    }
    
    // Get contact inquiries by service type
    public List<ContactEntity> getContactInquiriesByServiceType(String serviceType) {
        return contactRepository.findByServiceType(serviceType);
    }
    
    // Get contact inquiries by status
    public List<ContactEntity> getContactInquiriesByStatus(String status) {
        return contactRepository.findByStatus(status);
    }
    
    // Get recent contact inquiries (last 30 days)
    public List<ContactEntity> getRecentContactInquiries() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return contactRepository.findRecentContacts(thirtyDaysAgo);
    }
    
    // Update contact status
    public String updateContactStatus(Long id, String status) {
        try {
            Optional<ContactEntity> contactOpt = contactRepository.findById(id);
            if (contactOpt.isPresent()) {
                ContactEntity contact = contactOpt.get();
                contact.setStatus(status);
                contactRepository.save(contact);
                return "Contact status updated successfully to: " + status;
            } else {
                return "Contact not found with ID: " + id;
            }
        } catch (Exception e) {
            return "Error updating contact status: " + e.getMessage();
        }
    }
    
    // Get contact statistics
    public String getContactStatistics() {
        try {
            long totalContacts = contactRepository.count();
            List<ContactEntity> recentContacts = getRecentContactInquiries();
            
            StringBuilder stats = new StringBuilder();
            stats.append("Total Contact Inquiries: ").append(totalContacts).append("\n");
            stats.append("Recent Inquiries (Last 30 days): ").append(recentContacts.size()).append("\n");
            
            // Get count by service type
            List<Object[]> serviceTypeCounts = contactRepository.countByServiceType();
            if (!serviceTypeCounts.isEmpty()) {
                stats.append("Inquiries by Service Type:\n");
                for (Object[] count : serviceTypeCounts) {
                    stats.append("  - ").append(count[0]).append(": ").append(count[1]).append("\n");
                }
            }
            
            return stats.toString();
        } catch (Exception e) {
            return "Error getting statistics: " + e.getMessage();
        }
    }
}
