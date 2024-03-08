package com.example.Loginregister.Services;

import com.example.Loginregister.Model.Student;
import com.example.Loginregister.Repositries.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StudentService {
    private final StudentRepository studentRepository;

    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public void saveStudentWithInstallmentType(String studentId, String installmentType) {
        Optional<Student> optionalStudent = Optional.ofNullable(studentRepository.findByStudentId(studentId));
        if (optionalStudent.isPresent()) {
            Student student = optionalStudent.get();
            student.setInstallmentType(installmentType);
            studentRepository.save(student);
        }
    }
}
