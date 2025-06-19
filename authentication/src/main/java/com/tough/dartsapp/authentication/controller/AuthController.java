package com.tough.dartsapp.authentication.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AuthController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthController.class);

    @GetMapping("auth/status")
    public ResponseEntity<Void> authStatus() {
        LOGGER.info("GET auth/status request received");
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}