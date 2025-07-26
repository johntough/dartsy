package com.tough.dartsapp.authentication.service;

import com.tough.dartsapp.authentication.exception.UserNotFoundException;
import com.tough.dartsapp.authentication.model.User;
import com.tough.dartsapp.authentication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    UserRepository userRepository;

    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getAuthenticatedUserDetails(String userSub) {
        return userRepository.findById(userSub)
                .orElseThrow(() -> new UserNotFoundException("User not found for sub: " + userSub));
    }
}