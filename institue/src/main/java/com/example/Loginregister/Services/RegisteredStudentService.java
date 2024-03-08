package com.example.Loginregister.Services;

import com.example.Loginregister.Repositries.CourseRepository;
import com.example.Loginregister.Model.RegisteredStudent;
import com.example.Loginregister.Repositries.RegisteredStudentRepository;
import com.example.Loginregister.Repositries.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegisteredStudentService {

    private final RegisteredStudentRepository registeredStudentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;


    @Autowired
    public RegisteredStudentService(
            RegisteredStudentRepository registeredStudentRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository) {
        this.registeredStudentRepository = registeredStudentRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public RegisteredStudent registerStudent(RegisteredStudent student) {
        return registeredStudentRepository.save(student);
    }

    public List<RegisteredStudent> getAllRegisteredStudents() {
        return registeredStudentRepository.findAll();
    }

    public void deleteStudent(String studentId) {
        registeredStudentRepository.deleteById(studentId);
    }

    public List<RegisteredStudent> getRegisteredStudentsByInstituteKey(String instituteKey) {
        return registeredStudentRepository.findByInstituteKey(instituteKey);
    }

    public void deleteRegisteredStudent(String studentId, Long courseId) {
        registeredStudentRepository.deleteByStudentIdAndCourseId(studentId, courseId);
    }
    public List<RegisteredStudent> getMonthlyRegistrationsByInstituteKey(String instituteKey) {
        return registeredStudentRepository.findByInstituteKey(instituteKey);
    }

    }

