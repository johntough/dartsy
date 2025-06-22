package com.tough.dartsapp.authentication.controller;

import com.tough.dartsapp.authentication.model.User;
import com.tough.dartsapp.authentication.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AuthController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("auth/status")
    public ResponseEntity<User> authStatus(HttpServletRequest request) {
        LOGGER.info("GET auth/status request received");

        String userSub = (String) request.getAttribute("userSub");

        return ResponseEntity.ok(authService.getAuthenticatedUserDetails(userSub));
    }
}