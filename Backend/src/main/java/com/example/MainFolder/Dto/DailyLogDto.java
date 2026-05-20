package com.example.MainFolder.Dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DailyLogDto {
    private LocalDate logDate;
    private String tasksDone;
    private Double hoursWorked;
    private String challenges;
    private String planTomorrow;
    private String mood;
    private java.util.List<String> tools;
}
