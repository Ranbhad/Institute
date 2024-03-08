package com.example.Loginregister.Repositries;

import com.example.Loginregister.Model.RegisteredStudent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

// RegisteredStudentRepository interface
public interface RegisteredStudentRepository extends MongoRepository<RegisteredStudent, String> {
    // Additional methods if needed
    List<RegisteredStudent> findByStudentId(String studentId);

    List<RegisteredStudent> findByInstituteKey(String instituteKey);

    void deleteByStudentIdAndCourseId(String studentId, Long courseId);
}

