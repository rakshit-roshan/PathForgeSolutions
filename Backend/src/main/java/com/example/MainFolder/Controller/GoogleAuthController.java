package com.example.MainFolder.Controller;

import com.example.MainFolder.Dto.AuthResponseDto;
import com.example.MainFolder.Entity.UserEntity;
import com.example.MainFolder.Repository.UserRepository;
import com.example.MainFolder.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth/google")
public class GoogleAuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final WebClient webClient = WebClient.create("https://oauth2.googleapis.com");

    @PostMapping("/login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        String idToken = body.get("token");
        
        if (idToken == null || idToken.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Google ID Token is required"));
        }

        try {
            // In a real app, you should use GoogleIdTokenVerifier from google-api-client
            // For this demo, we use Google's tokeninfo endpoint
            Map<String, Object> tokenInfo = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/tokeninfo")
                            .queryParam("id_token", idToken)
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (tokenInfo == null || tokenInfo.containsKey("error")) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid Google Token"));
            }

            String email = (String) tokenInfo.get("email");
            String name = (String) tokenInfo.get("name");
            String picture = (String) tokenInfo.get("picture");

            Optional<UserEntity> userOpt = userRepository.findByEmail(email);
            UserEntity user;

            if (userOpt.isPresent()) {
                user = userOpt.get();
            } else {
                // Register new user via Google
                user = new UserEntity();
                user.setEmail(email);
                user.setUsername(name != null ? name : email.split("@")[0]);
                user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // Random password for social login
                user.setRole("CANDIDATE");
                user.setStatus("ACTIVE");
                user.setJoiningDate(LocalDate.now());
                userRepository.save(user);
            }

            String token = jwtUtil.generateToken(user);
            return ResponseEntity.ok(new AuthResponseDto(token, user, "Login successful via Google"));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Google Auth failed: " + e.getMessage()));
        }
    }
}
