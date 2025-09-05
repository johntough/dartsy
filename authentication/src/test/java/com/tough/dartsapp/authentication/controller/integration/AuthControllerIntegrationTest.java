package com.tough.dartsapp.authentication.controller.integration;

import com.tough.dartsapp.authentication.controller.AuthController;
import com.tough.dartsapp.authentication.exception.UserNotFoundException;
import com.tough.dartsapp.authentication.jwt.JwtAuthenticationFilter;
import com.tough.dartsapp.authentication.model.User;
import com.tough.dartsapp.authentication.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    AuthService authService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void testAuthStatusSuccess() throws Exception {
        when(authService.getAuthenticatedUserDetails(anyString()))
                .thenReturn(new User());

        mockMvc.perform(get("/auth/status")
                .requestAttr("userSub", "test-user-sub")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void testAuthStatusFailureNoUser404() throws Exception {

        doThrow(new UserNotFoundException("User not found"))
                .when(authService)
                .getAuthenticatedUserDetails(anyString());

        mockMvc.perform(get("/auth/status")
                .requestAttr("userSub", "test-user-sub"))
                .andExpect(status().isNotFound());
    }
}