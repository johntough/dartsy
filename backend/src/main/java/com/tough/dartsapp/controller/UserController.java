package com.tough.dartsapp.controller;

import com.tough.dartsapp.model.User;
import com.tough.dartsapp.model.UserInfo;
import com.tough.dartsapp.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

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

    @PutMapping("user/{userId}")
    public ResponseEntity<Void> updateUserProfile(@RequestBody User updatedUser, @PathVariable String userId, HttpServletRequest request) {
        LOGGER.info("PUT user/{} called", userId);

        String userSub = (String) request.getAttribute("userSub");

        if (!userSub.equals(updatedUser.getIdpSubject())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        userService.updateUserProfile(updatedUser);

        return ResponseEntity.noContent().build();
    }
}