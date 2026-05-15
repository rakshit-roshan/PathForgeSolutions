package com.example.MainFolder.Security;

import com.example.MainFolder.Entity.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    // You should put this in your application.properties or .env: 
    // jwt.secret=A_VERY_LONG_AND_SECURE_SECRET_KEY_FOR_JWT_THAT_IS_AT_LEAST_32_BYTES_LONG
    @Value("${jwt.secret:change-me-use-a-strong-secret-in-production-long-enough}")
    private String secret;

    @Value("${jwt.expiration:86400000}") // default 1 day
    private long expirationTime;

    private SecretKey getSigningKey() {
        // Fallback or pad if secret is too short, but better to enforce good secret
        byte[] keyBytes = secret.getBytes();
        if (keyBytes.length < 32) {
            String padded = secret + "padding_to_make_it_32_bytes_long_minimum";
            keyBytes = padded.getBytes();
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(UserEntity user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId());
        claims.put("name", user.getUsername());
        claims.put("role", user.getRole());
        claims.put("status", user.getStatus());
        if (user.getInternshipTrack() != null) {
            claims.put("internshipTrack", user.getInternshipTrack());
        }
        if (user.getJoiningDate() != null) {
            claims.put("joiningDate", user.getJoiningDate().toString());
        }

        return createToken(claims, user.getEmail());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Boolean validateToken(String token, String userEmail) {
        final String extractedEmail = extractEmail(token);
        return (extractedEmail.equals(userEmail) && !isTokenExpired(token));
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("role", String.class);
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
