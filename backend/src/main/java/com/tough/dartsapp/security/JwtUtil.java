package com.tough.dartsapp.security;

import com.tough.dartsapp.config.SecurityConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecurityConfig securityConfig;

    @Autowired
    public JwtUtil(SecurityConfig securityConfig) {
        this.securityConfig = securityConfig;
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getPublicKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return !claims.getExpiration().before(new Date());

        } catch (JwtException | IllegalArgumentException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            return false;
        }
    }

    public String getUserIdFromToken(String token) throws NoSuchAlgorithmException, InvalidKeySpecException {

        if (token != null && !token.isEmpty()) {
            Claims claims = Jwts.parser()
                    .verifyWith(getPublicKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.getSubject();
        } else {
            return "";
        }
    }

    private RSAPublicKey getPublicKey() throws NoSuchAlgorithmException, InvalidKeySpecException {

        byte[] publicKeyBytes = Base64.getDecoder().decode(securityConfig.getPublicKey());

        return (RSAPublicKey) KeyFactory.getInstance("RSA")
                .generatePublic(new X509EncodedKeySpec(publicKeyBytes));
    }
}