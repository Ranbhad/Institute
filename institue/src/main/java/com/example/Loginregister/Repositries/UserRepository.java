package com.example.Loginregister.Repositries;

import com.example.Loginregister.Model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
    User findByEmailAndCoursesIsNotNull(String email);
}