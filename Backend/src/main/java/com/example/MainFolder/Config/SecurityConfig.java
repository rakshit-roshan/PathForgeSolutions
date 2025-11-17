package com.example.MainFolder.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Disable CSRF for testing APIs
            .authorizeHttpRequests(api -> api
                .requestMatchers("/main/auth/**").permitAll() // allow all auth endpoints
                .requestMatchers("/main/contact").permitAll() // allow contact form submission (public)
                .requestMatchers("/main/contact/health").permitAll() // allow health check (public)
                .anyRequest().authenticated() // all other endpoints require authentication
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Always use patterns for flexibility (supports both exact URLs and wildcards)
        List<String> allowedOriginPatterns = new ArrayList<>();
        
        // Add localhost for local development
        allowedOriginPatterns.add("http://localhost:*");
        allowedOriginPatterns.add("https://localhost:*");
        
        // Add Netlify domains (supports any subdomain)
        allowedOriginPatterns.add("https://*.netlify.app");
        allowedOriginPatterns.add("https://*.netlify.com");
        
        // Add custom origins from environment variable if set
        String allowedOrigins = System.getenv("ALLOWED_ORIGINS");
        if (allowedOrigins != null && !allowedOrigins.isEmpty()) {
            // Split by comma and trim each origin
            String[] origins = allowedOrigins.split(",");
            for (String origin : origins) {
                String trimmed = origin.trim();
                if (!trimmed.isEmpty()) {
                    allowedOriginPatterns.add(trimmed);
                }
            }
        }
        
        // Use setAllowedOriginPatterns (supports both exact URLs and wildcards)
        configuration.setAllowedOriginPatterns(allowedOriginPatterns);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // Cache preflight for 1 hour
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
