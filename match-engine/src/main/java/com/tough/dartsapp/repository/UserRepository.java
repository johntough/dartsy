package com.tough.dartsapp.repository;

import com.tough.dartsapp.model.User;
import com.tough.dartsapp.model.UserInfo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    List<UserInfo> findAllBy();
}