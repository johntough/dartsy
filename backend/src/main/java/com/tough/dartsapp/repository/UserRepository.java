package com.tough.dartsapp.repository;

import com.tough.dartsapp.model.User;
import com.tough.dartsapp.model.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    List<UserInfo> findAllBy();
}