package com.example.MainFolder.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.MainFolder.Entity.UserEntity;
import com.example.MainFolder.Repository.UserRepository;
import com.example.MainFolder.Dto.UserRequestDto;
import com.example.MainFolder.Dto.LoginRequestDto;
import com.example.MainFolder.Dto.AuthResponseDto;
import com.example.MainFolder.Security.JwtUtil;

import java.time.LocalDate;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailNotificationService emailNotificationService;

    @jakarta.annotation.PostConstruct
    public void seedAdmin() {
        if (userRepository.findByEmail("admin@rasutech.in").isEmpty()) {
            UserEntity admin = new UserEntity();
            admin.setUsername("Admin");
            admin.setEmail("admin@rasutech.in");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setStatus("ACTIVE");
            admin.setEmployeeCode("PF-2026-ADMIN");
            admin.setJoiningDate(LocalDate.now());
            userRepository.save(admin);
            System.out.println("========== ADMIN SEEDED: admin@rasutech.in / admin123 ==========");
        }
    }

    public AuthResponseDto registerUser(UserRequestDto userRequestDto){
        if(userRepository.findByEmail(userRequestDto.getEmail()).isPresent()){
            return new AuthResponseDto(null, null, "Email already exists");
        }

        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(userRequestDto.getUsername());
        userEntity.setEmail(userRequestDto.getEmail());
        userEntity.setPassword(passwordEncoder.encode(userRequestDto.getPassword()));
        
        userEntity.setRole("CANDIDATE");
        userEntity.setStatus("PENDING");
        userEntity.setEmployeeCode("PF-2026-" + (new java.util.Random().nextInt(9000) + 1000));
        userEntity.setJoiningDate(LocalDate.now());

        userRepository.save(userEntity);
        
        // Generate token
        String token = jwtUtil.generateToken(userEntity);
        
        return new AuthResponseDto(token, userEntity, "User registered successfully");
    }
    
    public AuthResponseDto loginUser(LoginRequestDto loginRequestDto){
        var userOptional = userRepository.findByEmail(loginRequestDto.getEmail());
        
        if(userOptional.isEmpty()){
            return new AuthResponseDto(null, null, "User not found");
        }
        
        UserEntity user = userOptional.get();

        if (Boolean.TRUE.equals(user.getDisabled())) {
            return new AuthResponseDto(null, null, "Account suspended. Please contact your administrator.");
        }
        
        if(passwordEncoder.matches(loginRequestDto.getPassword(), user.getPassword())){
            user.setLastConnected(java.time.LocalDateTime.now());
            userRepository.save(user);
            
            // If candidate has 2FA enabled, prevent direct token delivery.
            // We notify the frontend to initiate OTP verification challenge instead.
            if (Boolean.TRUE.equals(user.getTwoFactorEnabled())) {
                // Generate a login OTP secret
                String otp = String.format("%06d", new java.util.Random().nextInt(1000000));
                user.setTwoFactorSecret(otp);
                user.setTwoFactorExpiry(java.time.LocalDateTime.now().plusMinutes(5));
                userRepository.save(user);

                // Dispatch OTP email
                String subject = "🔐 PathForge: Login Verification OTP";
                String body = String.format(
                    "Hello %s,\n\n" +
                    "Your 6-digit login verification OTP is: %s\n\n" +
                    "This code will expire in 5 minutes.\n\n" +
                    "Best regards,\n" +
                    "PathForge Security Team",
                    user.getUsername(), otp
                );
                try {
                    emailNotificationService.sendSimpleEmail(user.getEmail(), subject, body);
                    System.out.println("========== LOGIN 2FA CHALLENGE OTP: " + otp + " DISPATCHED INBOX ==========");
                } catch (Exception e) {
                    System.out.println("========== LOGIN 2FA MOCK: " + otp + " (PROVIDER EXCEPTION) ==========");
                }
                
                UserEntity mockUser = new UserEntity();
                mockUser.setEmail(user.getEmail());
                mockUser.setRole(user.getRole());
                mockUser.setUsername(user.getUsername());
                mockUser.setTwoFactorEnabled(true);
                return new AuthResponseDto(null, mockUser, "2FA_REQUIRED");
            }
            
            String token = jwtUtil.generateToken(user);
            return new AuthResponseDto(token, user, "Login successful");
        } else {
            return new AuthResponseDto(null, null, "Invalid password");
        }
    }

    public String forgotPassword(String email) {
        var userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return "If that email is registered, a reset link will be sent.";
        }

        UserEntity user = userOptional.get();
        String token = java.util.UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(java.time.LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        // Normally, send email here. For now, print to console.
        System.out.println("Mock Email -> Reset link: http://localhost:3000/reset-password?token=" + token);
        
        return "If that email is registered, a reset link will be sent. (Check server console for token)";
    }

    public String resetPassword(com.example.MainFolder.Dto.ResetPasswordDto dto) {
        var userOptional = userRepository.findByResetToken(dto.getToken());
        if (userOptional.isEmpty()) {
            return "Invalid or expired reset token.";
        }

        UserEntity user = userOptional.get();
        if (user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            return "Invalid or expired reset token.";
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return "Password successfully reset.";
    }
}
 