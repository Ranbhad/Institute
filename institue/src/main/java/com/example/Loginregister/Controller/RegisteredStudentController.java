package com.example.Loginregister.Controller;

import com.example.Loginregister.Model.Course;
import com.example.Loginregister.Repositries.RegisteredStudentRepository;
import com.example.Loginregister.Services.RegisteredStudentService;
import com.example.Loginregister.Repositries.CourseRepository;
import com.example.Loginregister.Model.RegisteredStudent;
import com.example.Loginregister.Model.Student;
import com.example.Loginregister.Repositries.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api")
public class RegisteredStudentController {
    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);
    private final RegisteredStudentService studentService;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private RegisteredStudentRepository registeredStudentRepository;
    private RegisteredStudentService registeredStudentService;

    private String name;
private final AtomicInteger batchNumberCounter = new AtomicInteger(1);

    private String generateBatchId(String batch) {
    int batchNumber = batchNumberCounter.getAndIncrement();
    return batch + "00" + batchNumber;
}
    @Autowired
    public RegisteredStudentController(RegisteredStudentService studentService,RegisteredStudentRepository registeredStudentRepository
            ,StudentRepository studentRepository, CourseRepository courseRepository) {
        this.studentService = studentService;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.registeredStudentRepository = registeredStudentRepository;    }
    @PostMapping("/register-student")
    public ResponseEntity<RegisteredStudent> registerStudent(@RequestBody RegisteredStudent student) {
        String batch = student.getBatch();
        String batchId = generateBatchId(batch);
        student.setBatchId(batchId);
        RegisteredStudent savedStudent = studentService.registerStudent(student);
        updateTotalCourseFees(savedStudent.getStudentId());
        updateAvailableSeats(savedStudent.getCourseId());
        return new ResponseEntity<>(savedStudent, HttpStatus.CREATED);
    }

    private void updateAvailableSeats(String courseId) {
        Optional<Course> optionalCourse = courseRepository.findById(courseId);
        if (optionalCourse.isPresent()) {
            Course course = optionalCourse.get();
            course.decrementAvailableSeats();
            courseRepository.save(course);
        }
    }
    private void incrementAvailableSeats(String courseId) {
        Optional<Course> optionalCourse = courseRepository.findById(courseId);
        if (optionalCourse.isPresent()) {
            Course course = optionalCourse.get();
            course.incrementAvailableSeats();
            courseRepository.save(course);
        }
    }

    private void updateTotalCourseFees(String studentId) {
        List<RegisteredStudent> registeredCourses = registeredStudentRepository.findByStudentId(studentId);
        Double sumOfCourseFees = registeredCourses.stream()
                .mapToDouble(course -> {
                    try {
                        return Double.parseDouble(course.getCourseFees());
                    } catch (NumberFormatException e) {
                        return 0.0;
                    }
                })
                .sum();
        Optional<Student> optionalStudent = Optional.ofNullable(studentRepository.findByStudentId(studentId));
        if (optionalStudent.isPresent()) {
            Student student = optionalStudent.get();
            student.setTotalCourseFees(sumOfCourseFees);
            studentRepository.save(student);
        }
    }

    @GetMapping("/registered-students")
    public ResponseEntity<List<RegisteredStudent>> getStudentsByInstituteKey (
            @RequestParam String instituteKey
    ){
        try {
            List<RegisteredStudent> registeredStudents = registeredStudentRepository.findByInstituteKey(instituteKey);
            logger.info("Retrieved students for instituteKey {}: {}", instituteKey, registeredStudents);
            return new ResponseEntity<>(registeredStudents, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error getting students for instituteKey {}", instituteKey, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/registered-students/{studentId}")
    public ResponseEntity<List<RegisteredStudent>> getRegisteredStudentsByStudentId (@PathVariable String studentId)
    {
        logger.info("Getting registered students by student ID: {}", studentId);
        List<RegisteredStudent> registeredStudents = registeredStudentRepository.findByStudentId(studentId);
        if (registeredStudents.isEmpty()) {
            throw new ResourceNotFoundException("No registered students found for student ID: " + studentId);
        }
        return ResponseEntity.ok(registeredStudents);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRegisteredStudent(@PathVariable String id) {
        try {
            Optional<RegisteredStudent> registeredStudentOptional = registeredStudentRepository.findById(id);
            if (!registeredStudentOptional.isPresent()) {
                return new ResponseEntity<>("Student not found", HttpStatus.NOT_FOUND);
            }
            RegisteredStudent student = registeredStudentOptional.get();
            String courseId = student.getCourseId();
            double courseFees = Double.parseDouble(student.getCourseFees());

            registeredStudentRepository.deleteById(id);
            incrementAvailableSeats(courseId);

            // Update total course fees for the student
            Optional<Student> optionalStudent = Optional.ofNullable(studentRepository.findByStudentId(student.getStudentId( )));
            if (optionalStudent.isPresent()) {
                Student foundStudent = optionalStudent.get();
                double totalCourseFees = foundStudent.getTotalCourseFees() - courseFees;
                foundStudent.setTotalCourseFees(totalCourseFees);
                studentRepository.save(foundStudent);
            }

            return new ResponseEntity<>("Student deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting student: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/monthly-registrations")
    public ResponseEntity<List<RegisteredStudent>> getMonthlyRegistrations(@RequestParam String instituteKey) {
        logger.info("Getting registered students by instituteKey: {}", instituteKey);
        List<RegisteredStudent> monthlyRegistrations = studentService.getMonthlyRegistrationsByInstituteKey(instituteKey);
        return ResponseEntity.ok(monthlyRegistrations);
    }

}
