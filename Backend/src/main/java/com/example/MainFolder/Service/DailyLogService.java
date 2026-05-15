package com.example.MainFolder.Service;

import com.example.MainFolder.Dto.DailyLogDto;
import com.example.MainFolder.Entity.DailyLogEntity;
import com.example.MainFolder.Entity.UserEntity;
import com.example.MainFolder.Repository.DailyLogRepository;
import com.example.MainFolder.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DailyLogService {

    @Autowired
    private DailyLogRepository dailyLogRepository;

    @Autowired
    private UserRepository userRepository;

    public List<DailyLogEntity> getMyLogs(String email) {
        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            return dailyLogRepository.findByCandidateIdOrderByLogDateDesc(userOpt.get().getId());
        }
        return List.of();
    }

    public DailyLogEntity createLog(String email, DailyLogDto dto) {
        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            UserEntity user = userOpt.get();
            DailyLogEntity log = new DailyLogEntity();
            log.setCandidateId(user.getId());
            log.setLogDate(dto.getLogDate());
            log.setTasksDone(dto.getTasksDone());
            log.setHoursWorked(dto.getHoursWorked());
            log.setChallenges(dto.getChallenges());
            log.setPlanTomorrow(dto.getPlanTomorrow());
            log.setMood(dto.getMood());

            return dailyLogRepository.save(log);
        }
        throw new RuntimeException("User not found");
    }

    public List<DailyLogEntity> getLogsForExport(String email) {
        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            // Ascending order is usually better for chronological reports
            return dailyLogRepository.findByCandidateIdOrderByLogDateAsc(userOpt.get().getId());
        }
        return List.of();
    }
}
