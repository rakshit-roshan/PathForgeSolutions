package com.example.MainFolder.Controller;

import com.example.MainFolder.Dto.AdminStatsDto;
import com.example.MainFolder.Dto.CandidateDetailDto;
import com.example.MainFolder.Entity.DailyLogEntity;
import com.example.MainFolder.Entity.UserEntity;
import com.example.MainFolder.Repository.DailyLogRepository;
import com.example.MainFolder.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DailyLogRepository dailyLogRepository;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> getStats() {
        AdminStatsDto stats = new AdminStatsDto();
        List<UserEntity> candidates = userRepository.findByRole("CANDIDATE");
        stats.setTotalCandidates(candidates.size());
        stats.setActiveCandidates(candidates.stream().filter(c -> "ACTIVE".equals(c.getStatus())).count());
        stats.setCompletedCandidates(candidates.stream().filter(c -> "COMPLETED".equals(c.getStatus())).count());
        stats.setOnHoldCandidates(candidates.stream().filter(c -> "ON_HOLD".equals(c.getStatus())).count());

        // We could write custom queries for today/week, but for now we can compute in memory
        List<DailyLogEntity> logs = dailyLogRepository.findAll();
        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(7);
        
        stats.setLogsSubmittedToday(logs.stream().filter(l -> l.getLogDate().isEqual(today)).count());
        stats.setLogsSubmittedThisWeek(logs.stream().filter(l -> l.getLogDate().isAfter(weekAgo) || l.getLogDate().isEqual(weekAgo)).count());
        
        if (!logs.isEmpty()) {
            double totalHours = logs.stream().mapToDouble(DailyLogEntity::getHoursWorked).sum();
            stats.setAverageHoursPerDay(totalHours / logs.size());
        }

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/candidates")
    public ResponseEntity<List<UserEntity>> getAllCandidates() {
        List<UserEntity> candidates = userRepository.findByRole("CANDIDATE");
        // Hide passwords
        candidates.forEach(c -> c.setPassword(null));
        return ResponseEntity.ok(candidates);
    }

    @GetMapping("/candidates/{id}")
    public ResponseEntity<?> getCandidateDetail(@PathVariable Long id) {
        Optional<UserEntity> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
        
        UserEntity user = userOpt.get();
        List<DailyLogEntity> logs = dailyLogRepository.findByCandidateIdOrderByLogDateDesc(id);
        
        CandidateDetailDto dto = new CandidateDetailDto();
        dto.setId(user.getId());
        dto.setName(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setJoiningDate(user.getJoiningDate());
        dto.setInternshipTrack(user.getInternshipTrack());
        dto.setDailyLogs(logs);
        
        dto.setTotalLogsSubmitted((long) logs.size());
        dto.setTotalHoursWorked(logs.stream().mapToDouble(DailyLogEntity::getHoursWorked).sum());
        
        if (!logs.isEmpty()) {
            dto.setLastLogDate(logs.get(0).getLogDate());
        }
        
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/candidates/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<UserEntity> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
        
        String newStatus = body.get("status");
        if (newStatus == null) return ResponseEntity.badRequest().body("Status is required");

        UserEntity user = userOpt.get();
        user.setStatus(newStatus);
        userRepository.save(user);
        
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
}
