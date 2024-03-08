package com.example.Loginregister.Repositries;

import com.example.Loginregister.Model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StudentRepository extends MongoRepository<Student, String> {
    // You can add custom query methods here if needed
    Student findByStudentId(String studentId);

    List<Student> findByInstituteKey(String instituteKey);


}
