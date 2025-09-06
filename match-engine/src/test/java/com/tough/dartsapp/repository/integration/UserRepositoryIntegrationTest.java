package com.tough.dartsapp.repository.integration;

import com.tough.dartsapp.model.User;
import com.tough.dartsapp.model.UserInfo;
import com.tough.dartsapp.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataMongoTest(properties = {
        "spring.data.mongodb.port=0"
})
@ActiveProfiles("test")
public class UserRepositoryIntegrationTest {

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
        User savedUser = userRepository.save(user);

        assertEquals("test-name", savedUser.getName());
        assertEquals("test@email.address", savedUser.getEmail());
        assertEquals("test-subject", savedUser.getIdpSubject());
    }

    @Test
    void testFindById() {
        User user = new User();
        user.setName("test-name");
        user.setEmail("test@email.address");
        user.setIdpSubject("test-subject");
        userRepository.save(user);

        User returnedUser = userRepository.findById("test-subject")
                .orElseThrow(() -> new AssertionError("User not found"));

        assertEquals("test-name", returnedUser.getName());
        assertEquals("test@email.address", returnedUser.getEmail());
        assertEquals("test-subject", returnedUser.getIdpSubject());
    }

    @Test
    void testFindByIdpSubjectNot() {
        User user1 = new User();
        user1.setName("test-name-1");
        user1.setEmail("test-1@email.address");
        user1.setIdpSubject("test-subject-1");
        userRepository.save(user1);

        User user2 = new User();
        user2.setName("test-name-2");
        user2.setEmail("test-2@email.address");
        user2.setIdpSubject("test-subject-2");
        User savedUser2 = userRepository.save(user2);

        List<UserInfo> userList = userRepository.findByIdpSubjectNot("test-subject-1");

        assertEquals(1, userList.size());
        UserInfo returnedUser = userList.getFirst();
        assertEquals(savedUser2.getName(), returnedUser.getName());
        assertEquals(savedUser2.getEmail(), returnedUser.getEmail());
        assertEquals(savedUser2.getIdpSubject(), returnedUser.getIdpSubject());
    }

    @Test
    void testFindByIdNoUsersExist() {
        Optional<User> users = userRepository.findById("test-subject");
        assertTrue(users.isEmpty());
    }
}