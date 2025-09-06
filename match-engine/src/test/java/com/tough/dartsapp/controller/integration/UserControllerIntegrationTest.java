package com.tough.dartsapp.controller.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tough.dartsapp.controller.UserController;
import com.tough.dartsapp.exception.UserNotFoundException;
import com.tough.dartsapp.model.LifetimeStats;
import com.tough.dartsapp.model.User;
import com.tough.dartsapp.security.JwtAuthenticationFilter;
import com.tough.dartsapp.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void testGetUsersSuccess() throws Exception {
        when(userService.getRemoteUsers(anyString()))
                .thenReturn(new ArrayList<>());

        mockMvc.perform(get("/remote/users")
                .requestAttr("userSub", "test-user-sub"))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateUserProfileSuccess() throws Exception {
        User user = new User();
        user.setIdpSubject("test-user-sub");
        user.setName("Test Name");
        user.setEmail("test@example.com");

        String userJson = objectMapper.writeValueAsString(user);

        mockMvc.perform(put("/user/test-user-sub")
                .requestAttr("userSub", "test-user-sub")
                .contentType("application/json")
                .content(userJson))
                .andExpect(status().isNoContent());
    }

    @Test
    void testUpdateUserProfileFailureUnauthorised401() throws Exception {
        User user = new User();
        user.setIdpSubject("test-user-sub");
        user.setName("Test Name");
        user.setEmail("test@example.com");

        String userJson = objectMapper.writeValueAsString(user);

        mockMvc.perform(put("/user/test-user-sub")
                .requestAttr("userSub", "fake-user-sub")
                .contentType("application/json")
                .content(userJson))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testUpdateUserProfileFailureUserNotFound404() throws Exception {
        User user = new User();
        user.setIdpSubject("test-user-sub");
        user.setName("Test Name");
        user.setEmail("test@example.com");

        doThrow(new UserNotFoundException("User not found"))
                .when(userService)
                .updateUserProfile(any());

        String userJson = objectMapper.writeValueAsString(user);

        mockMvc.perform(put("/user/test-user-sub")
                .requestAttr("userSub", "test-user-sub")
                .contentType("application/json")
                .content(userJson))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetLifetimeStatsFailureUnauthorised401() throws Exception {
        mockMvc.perform(get("/user/test-user-sub/lifetimeStats")
                .requestAttr("userSub", "fake-user-sub"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testGetLifetimeStatsSuccess() throws Exception {
        LifetimeStats lifetimeStats = new LifetimeStats();
        lifetimeStats.setGamesPlayed(1);
        lifetimeStats.setGamesWon(1);
        lifetimeStats.setBestLeg(11);
        lifetimeStats.setHighestCheckout(100);
        lifetimeStats.setTotalScore(501);
        lifetimeStats.setNumberOfDartsThrown(11);
        lifetimeStats.setOneHundredEightyScores(0);
        lifetimeStats.setOneHundredFortyPlusScores(1);
        lifetimeStats.setOneHundredPlusScores(2);

        when(userService.getLifetimeStatsForUser("test-user-sub")).thenReturn(lifetimeStats);

        mockMvc.perform(get("/user/test-user-sub/lifetimeStats")
                .requestAttr("userSub", "test-user-sub"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gamesPlayed").value(1))
                .andExpect(jsonPath("$.gamesWon").value(1))
                .andExpect(jsonPath("$.bestLeg").value(11))
                .andExpect(jsonPath("$.highestCheckout").value(100))
                .andExpect(jsonPath("$.totalScore").value(501))
                .andExpect(jsonPath("$.numberOfDartsThrown").value(11))
                .andExpect(jsonPath("$.oneHundredEightyScores").value(0))
                .andExpect(jsonPath("$.oneHundredFortyPlusScores").value(1))
                .andExpect(jsonPath("$.oneHundredPlusScores").value(2));;
    }
}
