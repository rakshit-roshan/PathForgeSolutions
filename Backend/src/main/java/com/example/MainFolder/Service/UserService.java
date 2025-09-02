package com.example.MainFolder.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.MainFolder.Entity.UserEntity;
import com.example.MainFolder.Repository.UserRepository;
import com.example.MainFolder.Dto.UserRequestDto;
import com.example.MainFolder.Dto.LoginRequestDto;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String registerUser(UserRequestDto userRequestDto){
        if(userRepository.findByEmail(userRequestDto.getEmail()).isPresent()){
            return "Email already exists";
        }

        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(userRequestDto.getUsername());
        userEntity.setEmail(userRequestDto.getEmail());
        userEntity.setPassword(passwordEncoder.encode(userRequestDto.getPassword()));
        
        userRepository.save(userEntity);
        return "User registered successfully";
    }
    
    public String loginUser(LoginRequestDto loginRequestDto){
        var userOptional = userRepository.findByEmail(loginRequestDto.getEmail());
        
        if(userOptional.isEmpty()){
            return "User not found";
        }
        
        UserEntity user = userOptional.get();
        
        if(passwordEncoder.matches(loginRequestDto.getPassword(), user.getPassword())){
            return "Login successful";
        } else {
            return "Invalid password";
        }
    }
}
