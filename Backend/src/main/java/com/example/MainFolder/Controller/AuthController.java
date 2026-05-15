package com.example.MainFolder.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.MainFolder.Service.UserService;
import com.example.MainFolder.Entity.UserEntity;
import com.example.MainFolder.Repository.UserRepository;
import com.example.MainFolder.Dto.UserRequestDto;
import com.example.MainFolder.Dto.LoginRequestDto;
import com.example.MainFolder.Dto.AuthResponseDto;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRequestDto userRequestDto){
        AuthResponseDto response = userService.registerUser(userRequestDto);
        if (response.getToken() == null) {
            return ResponseEntity.badRequest().body(response.getMessage());
        }
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto){
        AuthResponseDto response = userService.loginUser(loginRequestDto);
        if (response.getToken() == null) {
            return ResponseEntity.status(401).body(response.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        String email = authentication.getName();
        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            // Avoid exposing password
            UserEntity user = userOpt.get();
            user.setPassword(null);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(404).body("User not found");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody java.util.Map<String, String> payload) {
        String email = payload.get("email");
        if (email == null) return ResponseEntity.badRequest().body("Email required.");
        String message = userService.forgotPassword(email);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody com.example.MainFolder.Dto.ResetPasswordDto dto) {
        if (dto.getToken() == null || dto.getNewPassword() == null) {
            return ResponseEntity.badRequest().body("Token and new password required.");
        }
        String message = userService.resetPassword(dto);
        if (message.contains("Invalid")) {
            return ResponseEntity.badRequest().body(message);
        }
        return ResponseEntity.ok(message);
    }
}
