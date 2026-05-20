package com.example.MainFolder.Controller;

import com.example.MainFolder.Entity.UserEntity;
import com.example.MainFolder.Repository.UserRepository;
import com.example.MainFolder.Service.EmailNotificationService;
import com.example.MainFolder.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/security")
public class SecurityController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailNotificationService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Generates and dispatches a 6-digit OTP for 2FA validation via registered email.
     */
    @PostMapping("/2fa/generate")
    public ResponseEntity<?> generateOtp(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized session.");
        
        Optional<UserEntity> userOpt = userRepository.findByEmail(authentication.getName());
        if (userOpt.isEmpty()) return ResponseEntity.status(404).body("User not found.");

        UserEntity user = userOpt.get();
        String otp = String.format("%06d", new Random().nextInt(1000000));
        
        user.setTwoFactorSecret(otp);
        user.setTwoFactorExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        // Send OTP via secure email
        String emailSubject = "🔐 PathForge Console: Secure OTP Verification Code";
        String emailBody = String.format(
                "Hello %s,\n\n" +
                "Your 6-digit verification code is: %s\n\n" +
                "This code will expire in 5 minutes. If you did not request this code, please secure your credentials immediately.\n\n" +
                "Best regards,\n" +
                "PathForge Security Team",
                user.getUsername(), otp
        );
        emailService.sendSimpleEmail(user.getEmail(), emailSubject, emailBody);

        return ResponseEntity.ok(Map.of("message", "Security OTP transmitted successfully. Please verify your inbox."));
    }

    /**
     * Verifies the 6-digit OTP to toggle 2FA state.
     */
    @PostMapping("/2fa/verify")
    public ResponseEntity<?> verifyOtp(Authentication authentication, @RequestBody Map<String, String> payload) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized session.");
        
        String otp = payload.get("otp");
        if (otp == null || otp.trim().length() != 6) {
            return ResponseEntity.badRequest().body("Validation failed: 6-digit security OTP required.");
        }

        Optional<UserEntity> userOpt = userRepository.findByEmail(authentication.getName());
        if (userOpt.isEmpty()) return ResponseEntity.status(404).body("User not found.");

        UserEntity user = userOpt.get();
        
        if (user.getTwoFactorSecret() == null || !user.getTwoFactorSecret().equals(otp.trim())) {
            return ResponseEntity.badRequest().body("Security failure: Invalid OTP code provided.");
        }

        if (user.getTwoFactorExpiry() == null || user.getTwoFactorExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Security failure: OTP code has expired.");
        }

        // Toggle 2FA state
        user.setTwoFactorEnabled(!user.getTwoFactorEnabled());
        user.setTwoFactorSecret(null); // Clear secret
        user.setTwoFactorExpiry(null);
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "2-Factor Authentication state successfully updated.");
        response.put("twoFactorEnabled", user.getTwoFactorEnabled());
        return ResponseEntity.ok(response);
    }

    /**
     * 2-Step Login check for accounts with 2FA enabled.
     */
    @PostMapping("/2fa/login-verify")
    public ResponseEntity<?> verifyLoginOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = payload.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body("Email and 6-digit OTP code required.");
        }

        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(404).body("User not found.");

        UserEntity user = userOpt.get();
        if (Boolean.TRUE.equals(user.getDisabled())) {
            return ResponseEntity.status(403).body("Account suspended. Please contact your administrator.");
        }

        if (user.getTwoFactorSecret() == null || !user.getTwoFactorSecret().equals(otp.trim())) {
            return ResponseEntity.badRequest().body("Invalid verification code.");
        }

        if (user.getTwoFactorExpiry() == null || user.getTwoFactorExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Verification code has expired.");
        }

        // OTP verified successfully
        user.setTwoFactorSecret(null);
        user.setTwoFactorExpiry(null);
        user.setLastConnected(LocalDateTime.now());
        userRepository.save(user);

        // Generate full JWT access token
        String token = jwtUtil.generateToken(user);
        user.setPassword(null); // Protect credentials
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        response.put("message", "2FA authentication successful.");
        return ResponseEntity.ok(response);
    }

    /**
     * Admin override to suspend or reinstate any candidate's account access.
     */
    @PutMapping("/admin/candidates/{id}/suspend")
    public ResponseEntity<?> toggleSuspension(Authentication authentication, @PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized session.");
        
        // Ensure request is made by an Admin
        Optional<UserEntity> adminOpt = userRepository.findByEmail(authentication.getName());
        if (adminOpt.isEmpty() || !"ADMIN".equals(adminOpt.get().getRole())) {
            return ResponseEntity.status(403).body("Access Denied: Administrative privileges required.");
        }

        Optional<UserEntity> candidateOpt = userRepository.findById(id);
        if (candidateOpt.isEmpty()) return ResponseEntity.notFound().build();

        UserEntity candidate = candidateOpt.get();
        Boolean disabled = payload.get("disabled");
        if (disabled == null) return ResponseEntity.badRequest().body("Missing suspension state boolean.");

        candidate.setDisabled(disabled);
        userRepository.save(candidate);

        return ResponseEntity.ok(Map.of(
                "message", disabled ? "Candidate account access successfully suspended." : "Candidate account access restored.",
                "disabled", candidate.getDisabled()
        ));
    }

    /**
     * Admin override to modify remaining duration and lifecycle details.
     */
    @PutMapping("/admin/candidates/{id}/lifecycle")
    public ResponseEntity<?> updateLifecycle(Authentication authentication, @PathVariable Long id, @RequestBody Map<String, Object> payload) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized session.");
        
        Optional<UserEntity> adminOpt = userRepository.findByEmail(authentication.getName());
        if (adminOpt.isEmpty() || !"ADMIN".equals(adminOpt.get().getRole())) {
            return ResponseEntity.status(403).body("Access Denied: Administrative privileges required.");
        }

        Optional<UserEntity> candidateOpt = userRepository.findById(id);
        if (candidateOpt.isEmpty()) return ResponseEntity.notFound().build();

        UserEntity candidate = candidateOpt.get();
        
        if (payload.containsKey("durationMonths")) {
            candidate.setInternshipDurationMonths(Integer.parseInt(payload.get("durationMonths").toString()));
        }
        
        if (payload.containsKey("twoFactorEnabled")) {
            candidate.setTwoFactorEnabled(Boolean.parseBoolean(payload.get("twoFactorEnabled").toString()));
        }

        if (payload.containsKey("status")) {
            candidate.setStatus(payload.get("status").toString());
        }

        if (payload.containsKey("internshipTrack")) {
            candidate.setInternshipTrack(payload.get("internshipTrack").toString());
        }

        userRepository.save(candidate);
        candidate.setPassword(null);
        return ResponseEntity.ok(candidate);
    }

    /**
     * Updates candidate profile credentials (LinkedIn style).
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody Map<String, String> payload) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized session.");
        
        Optional<UserEntity> userOpt = userRepository.findByEmail(authentication.getName());
        if (userOpt.isEmpty()) return ResponseEntity.status(404).body("User not found.");

        UserEntity user = userOpt.get();
        
        if (payload.containsKey("collegeName")) {
            user.setCollegeName(payload.get("collegeName"));
        }
        if (payload.containsKey("bio")) {
            user.setBio(payload.get("bio"));
        }
        if (payload.containsKey("profilePic")) {
            user.setProfilePic(payload.get("profilePic"));
        }

        userRepository.save(user);
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
}
