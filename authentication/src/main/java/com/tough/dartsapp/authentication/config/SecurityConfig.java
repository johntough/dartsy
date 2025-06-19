package com.tough.dartsapp.authentication.config;

import com.tough.dartsapp.authentication.oauth2.CustomOidcUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final String privateKey;

    private final String publicKey;

    private final CustomOidcUserService customOidcUserService;

    @Autowired
    public SecurityConfig(CustomOidcUserService customOidcUserService, @Value("${PRIVATE_KEY}") String privateKey, @Value("${PUBLIC_KEY}") String publicKey) {
        this.customOidcUserService = customOidcUserService;
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity, CustomAuthenticationSuccessHandler successHandler) throws Exception {
        httpSecurity.authorizeHttpRequests(auth -> auth
             .requestMatchers("/auth/status").permitAll()
             .anyRequest().authenticated()
        )
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
        .oauth2Login(oauth2 ->
            oauth2.userInfoEndpoint(
                userInfo ->
                    userInfo.oidcUserService(customOidcUserService)
            )
            .successHandler(successHandler)
        )
        .logout(logout -> logout
                .logoutUrl("/auth/logout")
                .deleteCookies("jwt")
                .invalidateHttpSession(true)
                .clearAuthentication(true)
                .logoutSuccessUrl("http://localhost:3000").permitAll()
        );

        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    public String getPrivateKey() { return privateKey; }

    public String getPublicKey() { return publicKey; }
}