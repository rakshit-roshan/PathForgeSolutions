package com.example.MainFolder.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.MainFolder.Service.UserService;
import com.example.MainFolder.Entity.UserEntity;

@RestController
@RequestMapping("/main")
public class UserController {
    
    @Autowired
    private UserService userService;

    @PostMapping("/auth/register")
    public String register(@RequestBody UserEntity userEntity){
        return userService.registerUser(userEntity);
    }
}
