package com.example.MainFolder.Dto;

import lombok.Data;

@Data
public class AdminStatsDto {
    private long totalCandidates;
    private long activeCandidates;
    private long completedCandidates;
    private long onHoldCandidates;
    private long logsSubmittedToday;
    private long logsSubmittedThisWeek;
    private double averageHoursPerDay;
}
