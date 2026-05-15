package com.example.MainFolder.Dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UserRequestDto {
    @JsonProperty("name")
    private String username;
    private String email;
    private String password;
}
