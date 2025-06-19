package com.tough.dartsapp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SecurityConfig {

    @Value(value = "${PUBLIC_KEY}")
    private String publicKey;

    public String getPublicKey() { return publicKey; }
}