package com.example.MainFolder.Dto;

import com.example.MainFolder.Entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDto {
    private String token;
    private UserEntity user;
    private String message;
}
