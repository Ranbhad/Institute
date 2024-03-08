package com.example.Loginregister.Repositries;

import com.example.Loginregister.Model.Admin;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AdminRepository extends MongoRepository<Admin, String> {
    Admin findByEmail(String email);
    boolean existsByInstituteKey(String instituteKey);

}