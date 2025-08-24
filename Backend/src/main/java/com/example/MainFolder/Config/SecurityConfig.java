package com.example.MainFolder.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
            .ignoringRequestMatchers("/h2-console/**") // disable CSRF for H2 console
            .disable()) // Disable CSRF for testing APIs
            .authorizeHttpRequests(api -> api
                .requestMatchers("/api/register").permitAll()
                .requestMatchers("/h2-console/**").permitAll() // allow H2 console
                .anyRequest().authenticated()
            )
             .headers(headers -> headers.frameOptions().disable()); // allow frames for H2

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
