package com.example.MainFolder.Repository;

import com.example.MainFolder.Entity.ContactEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<ContactEntity, Long> {
    
    // Find contacts by email
    List<ContactEntity> findByEmail(String email);
    
    // Find contacts by service type
    List<ContactEntity> findByServiceType(String serviceType);
    
    // Find contacts by status
    List<ContactEntity> findByStatus(String status);
    
    // Find contacts created between dates
    @Query("SELECT c FROM ContactEntity c WHERE c.createdAt BETWEEN :startDate AND :endDate ORDER BY c.createdAt DESC")
    List<ContactEntity> findContactsByDateRange(@Param("startDate") LocalDateTime startDate, 
                                                @Param("endDate") LocalDateTime endDate);
    
    // Find recent contacts (last 30 days)
    @Query("SELECT c FROM ContactEntity c WHERE c.createdAt >= :since ORDER BY c.createdAt DESC")
    List<ContactEntity> findRecentContacts(@Param("since") LocalDateTime since);
    
    // Count contacts by service type
    @Query("SELECT c.serviceType, COUNT(c) FROM ContactEntity c GROUP BY c.serviceType")
    List<Object[]> countByServiceType();
    
    // Find contacts by preferred contact method
    List<ContactEntity> findByPreferredContactMethod(String preferredContactMethod);
}
