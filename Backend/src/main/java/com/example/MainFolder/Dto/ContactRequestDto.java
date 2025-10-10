package com.example.MainFolder.Dto;

import lombok.Data;

@Data
public class ContactRequestDto {
    // Basic Information
    private String name;
    private String email;
    private String phone;
    private String serviceType;
    
    // Internship specific fields (optional)
    private String internshipTrack;
    private String duration;
    private String experienceLevel;
    private String customIdea;
    
    // Message
    private String message;
    
    // Contact preferences
    private String preferredContactMethod;
    private String preferredDate;  // For phone call scheduling
    private String preferredTime;  // For phone call scheduling
    
    // Validation method
    public boolean isValid() {
        return name != null && !name.trim().isEmpty() &&
               email != null && !email.trim().isEmpty() &&
               phone != null && !phone.trim().isEmpty() &&
               serviceType != null && !serviceType.trim().isEmpty() &&
               message != null && !message.trim().isEmpty() &&
               preferredContactMethod != null && !preferredContactMethod.trim().isEmpty();
    }
}
