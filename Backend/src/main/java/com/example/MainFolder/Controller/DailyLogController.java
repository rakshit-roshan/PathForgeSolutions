package com.example.MainFolder.Controller;

import com.example.MainFolder.Dto.DailyLogDto;
import com.example.MainFolder.Entity.DailyLogEntity;
import com.example.MainFolder.Service.DailyLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/daily-logs")
public class DailyLogController {

    @Autowired
    private DailyLogService dailyLogService;

    @GetMapping("/my")
    public ResponseEntity<List<DailyLogEntity>> getMyLogs(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(dailyLogService.getMyLogs(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<?> createLog(Authentication authentication, @RequestBody DailyLogDto dto) {
        if (authentication == null) return ResponseEntity.status(401).build();
        try {
            DailyLogEntity log = dailyLogService.createLog(authentication.getName(), dto);
            return ResponseEntity.ok(log);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/export")
    public ResponseEntity<List<DailyLogEntity>> getLogsForExport(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(dailyLogService.getLogsForExport(authentication.getName()));
    }
}
