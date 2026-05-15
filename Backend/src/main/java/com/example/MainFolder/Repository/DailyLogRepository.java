package com.example.MainFolder.Repository;

import com.example.MainFolder.Entity.DailyLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyLogRepository extends JpaRepository<DailyLogEntity, Long> {
    List<DailyLogEntity> findByCandidateIdOrderByLogDateDesc(Long candidateId);
    List<DailyLogEntity> findByCandidateIdOrderByLogDateAsc(Long candidateId);
}
