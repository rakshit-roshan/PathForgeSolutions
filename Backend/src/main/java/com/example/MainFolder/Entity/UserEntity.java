package com.example.MainFolder.Entity;

import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import lombok.Data;

@Data
@Entity
@Table(name="user_details")
public class UserEntity {
    @Id 
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    private String username;

    @Column(nullable = false, unique=true)
    private String email;
    private String password;

}
