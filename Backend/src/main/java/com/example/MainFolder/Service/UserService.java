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

    @jakarta.annotation.PostConstruct
    public void seedAdmin() {
        if (userRepository.findByEmail("admin@rasutech.in").isEmpty()) {
            UserEntity admin = new UserEntity();
            admin.setUsername("Admin");
            admin.setEmail("admin@rasutech.in");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setStatus("ACTIVE");
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
        
        // Example: Default role CANDIDATE. In real app, you might get this from request or enforce it.
        // Also joiningDate could be set to now.
        userEntity.setRole("CANDIDATE");
        userEntity.setStatus("ACTIVE");
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
        
        if(passwordEncoder.matches(loginRequestDto.getPassword(), user.getPassword())){
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
 