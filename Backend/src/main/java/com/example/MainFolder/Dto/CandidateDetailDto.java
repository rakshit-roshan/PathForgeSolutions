package com.example.MainFolder.Dto;

import com.example.MainFolder.Entity.DailyLogEntity;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CandidateDetailDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String status;
    private LocalDate joiningDate;
    private String internshipTrack;
    
    private List<DailyLogEntity> dailyLogs;
    private Double totalHoursWorked;
    private Long totalLogsSubmitted;
    private LocalDate lastLogDate;
    private Double completionPercentage;
}
