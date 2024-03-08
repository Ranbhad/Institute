package com.example.Loginregister.Repositries;


import com.example.Loginregister.Model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CourseRepository extends MongoRepository<Course, String> {
    // Additional custom queries can be added here if needed
    List<Course> findByInstituteKey(String instituteKey);


}

