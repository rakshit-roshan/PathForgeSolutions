package com.example.MainFolder.Repository;

import com.example.MainFolder.Entity.DocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity, Long> {
    List<DocumentEntity> findByRecipientIdOrderByIssuedDateDesc(Long recipientId);
    List<DocumentEntity> findByRecipientIdAndStatusOrderByIssuedDateDesc(Long recipientId, String status);
    List<DocumentEntity> findAllByOrderByIssuedDateDesc();
}
