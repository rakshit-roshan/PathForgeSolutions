package com.example.MainFolder.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.MainFolder.Service.UserService;
import com.example.MainFolder.Dto.UserRequestDto;
import com.example.MainFolder.Dto.LoginRequestDto;

@RestController
@RequestMapping("/main")
public class UserController {
    
    @Autowired
    private UserService userService;

    @PostMapping("/auth/register")
    public String register(@RequestBody UserRequestDto userRequestDto){
        return userService.registerUser(userRequestDto);
    }
    
    @PostMapping("/auth/login")
    public String login(@RequestBody LoginRequestDto loginRequestDto){
        return userService.loginUser(loginRequestDto);
    }
}
