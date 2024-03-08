package com.example.Loginregister.Controller;

import com.example.Loginregister.Model.Student;
import com.example.Loginregister.Repositries.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);
    private final StudentRepository studentRepository;
    @Autowired
    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }
    @PostMapping
    public ResponseEntity<Student> saveStudent(@RequestBody Student student) {
        try {
            Student savedStudent = studentRepository.save(student);
            logger.info("Student saved: {}", savedStudent);
            return new ResponseEntity<>(savedStudent, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error saving student", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/{studentId}")
    public ResponseEntity<Student> getStudentById(@PathVariable String studentId) {
        try {
            Student student = studentRepository.findByStudentId(studentId);
            if (student != null) {
                logger.info("Student found: {}", student);
                return new ResponseEntity<>(student, HttpStatus.OK);
            } else {
                logger.warn("Student not found with id: {}", studentId);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error getting student by id", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/students")
    public ResponseEntity<List<Student>> getStudentsByInstituteKey(
            @RequestParam String instituteKey
    ) {
        try {
            List<Student> students = studentRepository.findByInstituteKey(instituteKey);

            logger.info("Retrieved students for instituteKey {}: {}", instituteKey, students);
            return new ResponseEntity<>(students, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error getting students for instituteKey {}", instituteKey, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/pay-fees")
    public ResponseEntity<Student> payFees(@RequestBody Student studentRequest) {
        try {
            Student student = studentRepository.findByStudentId(studentRequest.getStudentId());
            if (student != null) {
                String installmentType = studentRequest.getInstallmentType();
                if ("3months".equals(installmentType) || "6months".equals(installmentType) || "full".equals(installmentType)) {
                    Double paidFees = studentRequest.getPaidFees();
                    Double totalPaidFees = student.getPaidFees();
                    Double totalCourseFees = student.getTotalCourseFees();
                    Double balanceFees = totalCourseFees - (totalPaidFees + paidFees);
                    student.setInstallmentType(installmentType);
                    student.setPaidFees(totalPaidFees + paidFees);
                    student.setBalanceFees(balanceFees);
                    switch (installmentType) {
                        case "3months":
                            student.setTotalInstallments(3);
                            break;
                        case "6months":
                            student.setTotalInstallments(6);
                            break;
                        case "full":
                            student.setTotalInstallments(1);
                            break;
                        default:
                           break;
                    }
                    int paidInstallments = student.getPaidInstallments() + 1;
                    if (paidInstallments <= student.getTotalInstallments()) {
                        student.setPaidInstallments(paidInstallments);
                        if ("3months".equals(installmentType) && paidInstallments == 3 && student.getBalanceFees() > 0) {
                            logger.warn("Balance amount should be paid in the third installment for studentId: {}", studentRequest.getStudentId());
                        }
                        Student updatedStudent = studentRepository.save(student);
                        logger.info("Fees paid successfully for studentId: {}", studentRequest.getStudentId());
                        return new ResponseEntity<>(updatedStudent, HttpStatus.OK);
                    } else {
                        logger.warn("Paid installments cannot exceed total installments for studentId: {}", studentRequest.getStudentId());
                        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                    }
                } else {
                   logger.warn("Invalid installment type for studentId: {}", studentRequest.getStudentId());
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            } else {
                logger.warn("Student not found with id: {}", studentRequest.getStudentId());
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error paying fees", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
