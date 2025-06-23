package com.tough.dartsapp.controller;

import com.tough.dartsapp.model.UserInfo;
import com.tough.dartsapp.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class UserController {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("users")
    public ResponseEntity<List<UserInfo>> getUsers() {
        LOGGER.info("GET users called");

        List<UserInfo> users = userService.getUsers();

        return ResponseEntity.ok().body(users);
    }
}