package com.example.Loginregister.Repositries;

import com.example.Loginregister.Model.Faculty;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FacultyRepository extends MongoRepository <Faculty, String> {
    Faculty findByEmail(String email);
}
