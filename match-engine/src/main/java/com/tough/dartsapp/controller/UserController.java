package com.tough.dartsapp.controller;

import com.tough.dartsapp.model.LifetimeStats;
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

    @GetMapping("/remote/users")
    public ResponseEntity<List<UserInfo>> getUsers(HttpServletRequest request) {
        LOGGER.info("GET users called");

        String userSubject = (String) request.getAttribute("userSub");
        List<UserInfo> users = userService.getRemoteUsers(userSubject);

        return ResponseEntity.ok().body(users);
    }

    @PutMapping("user/{userId}")
    public ResponseEntity<Void> updateUserProfile(@RequestBody User updatedUser, @PathVariable String userId, HttpServletRequest request) {
        LOGGER.info("PUT user/{} called", userId);

        String userSubject = (String) request.getAttribute("userSub");

        if (!userSubject.equals(userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        userService.updateUserProfile(updatedUser);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("user/{userId}/lifetimeStats")
    public ResponseEntity<LifetimeStats> getLifetimeStats(@PathVariable String userId, HttpServletRequest request) {
        LOGGER.info("Get user/{}/lifetimeStats called", userId);

        String userSubject = (String) request.getAttribute("userSub");

        if (!userSubject.equals(userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        LifetimeStats lifetimeStats = userService.getLifetimeStatsForUser(userId);

        return ResponseEntity.ok().body(lifetimeStats);
    }
}