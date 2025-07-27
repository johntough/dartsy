package com.tough.dartsapp.matchcompletion.repository;

import com.tough.dartsapp.matchcompletion.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

}