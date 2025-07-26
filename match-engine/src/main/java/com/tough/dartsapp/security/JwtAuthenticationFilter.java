package com.tough.dartsapp.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Autowired
    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            setResponseHeaders(response);
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        String token = extractTokenFromRequest(request);

        if (token != null && jwtUtil.validateToken(token)) {
            try {
                request.setAttribute("userSub", jwtUtil.getUserIdFromToken(token));
                request.setAttribute("darts-app-jwt", token);
                filterChain.doFilter(request, response);
                setResponseHeaders(response);
            } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
                setResponseHeaders(response);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            }
        } else {
            setResponseHeaders(response);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("darts-app-jwt".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    private void setResponseHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "*");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }
}