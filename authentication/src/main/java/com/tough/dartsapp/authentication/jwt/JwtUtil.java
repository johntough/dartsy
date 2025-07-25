package com.tough.dartsapp.authentication.jwt;

import com.tough.dartsapp.authentication.config.SecurityConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Component;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtil {

    private static final Logger LOGGER = LoggerFactory.getLogger(JwtUtil.class);

    private final SecurityConfig securityConfig;

    @Autowired
    public JwtUtil(SecurityConfig securityConfig) {
        this.securityConfig = securityConfig;
    }

    public String createToken(OidcUser oidcUser) throws NoSuchAlgorithmException, InvalidKeySpecException {

        String userSub = oidcUser.getSubject();
        LOGGER.info("Creating JWT token for User ID: {}", userSub);

        return Jwts.builder()
                .subject(userSub)
                .claim("roles", List.of("ROLE_USER"))
                .claim("userName", oidcUser.getName())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(createPrivateKey())
                .compact();
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

    private RSAPrivateKey createPrivateKey() throws NoSuchAlgorithmException, InvalidKeySpecException {

        byte[] privateKeyBytes = Base64.getDecoder().decode(securityConfig.getPrivateKey());

        return (RSAPrivateKey) KeyFactory.getInstance("RSA")
                .generatePrivate(new PKCS8EncodedKeySpec(privateKeyBytes));
    }

    private RSAPublicKey getPublicKey() throws NoSuchAlgorithmException, InvalidKeySpecException {

        byte[] publicKeyBytes = Base64.getDecoder().decode(securityConfig.getPublicKey());

        return (RSAPublicKey) KeyFactory.getInstance("RSA")
                .generatePublic(new X509EncodedKeySpec(publicKeyBytes));
    }
}