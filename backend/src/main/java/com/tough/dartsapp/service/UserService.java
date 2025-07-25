package com.tough.dartsapp.service;

import com.tough.dartsapp.controller.MatchController;
import com.tough.dartsapp.exception.UserNotFoundException;
import com.tough.dartsapp.model.User;
import com.tough.dartsapp.model.UserInfo;
import com.tough.dartsapp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserInfo> getUsers() {
        return userRepository.findAllBy();
    }

    public void updateUserProfile(User updatedUser) {
        User existingUser = userRepository.findById(updatedUser.getId())
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + updatedUser.getId()));

        if (!existingUser.getIdpSubject().equals(updatedUser.getIdpSubject())) {
            LOGGER.warn("Provided idpSubject {} differs from existingUser.getIdpSubject(): {}", updatedUser.getIdpSubject(), existingUser.getIdpSubject());
        }

        // only name and location should be modifiable
        existingUser.setName(updatedUser.getName());
        existingUser.setLocation(updatedUser.getLocation());

        userRepository.save(existingUser);
    }
}