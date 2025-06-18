package com.tough.dartsapp.authentication.repository;

import com.tough.dartsapp.authentication.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByIdpSubject(String idpSubject);
}