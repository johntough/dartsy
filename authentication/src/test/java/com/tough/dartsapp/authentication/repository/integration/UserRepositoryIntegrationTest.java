package com.tough.dartsapp.authentication.repository.integration;

import com.tough.dartsapp.authentication.model.User;
import com.tough.dartsapp.authentication.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DataMongoTest(properties = {
        "spring.data.mongodb.port=0"
})
@ActiveProfiles("test")
class UserRepositoryIntegrationTest {

    @Autowired
    UserRepository userRepository;

    @BeforeEach
    void cleanDatabase() {
        userRepository.deleteAll();
    }

    @Test
    void testSaveUser() {
        User user = new User();
        user.setName("test-name");
        user.setEmail("test@email.address");
        user.setIdpSubject("test-subject");
        user.setRoles(Set.of("ROLE_USER"));
        User savedUser = userRepository.save(user);

        assertEquals("test-name", savedUser.getName());
        assertEquals("test@email.address", savedUser.getEmail());
        assertEquals("test-subject", savedUser.getIdpSubject());
        assertTrue(savedUser.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_USER")));
    }

    @Test
    void testFindByGoogleSubject() {
        User user = new User();
        user.setName("test-name");
        user.setEmail("test@email.address");
        user.setIdpSubject("test-subject");
        user.setRoles(Set.of("ROLE_USER"));
        User savedUser = userRepository.save(user);

        Optional<User> returnedUser = userRepository.findById("test-subject");
        assertTrue(returnedUser.isPresent());

        assertEquals("test-name", savedUser.getName());
        assertEquals("test@email.address", savedUser.getEmail());
        assertEquals("test-subject", savedUser.getIdpSubject());
        assertTrue(savedUser.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_USER")));
    }

    @Test
    void testFindByGoogleSubjectNoUsersExist() {
        Optional<User> users = userRepository.findById("test-subject");
        assertTrue(users.isEmpty());
    }
}
