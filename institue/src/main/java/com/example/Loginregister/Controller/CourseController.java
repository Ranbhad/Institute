package com.example.Loginregister.Controller;

import com.example.Loginregister.Model.Faculty;
import com.example.Loginregister.Repositries.CourseRepository;
import com.example.Loginregister.Services.CourseService;
import com.example.Loginregister.Model.Admin;
import com.example.Loginregister.Repositries.AdminRepository;
import com.example.Loginregister.Model.User;
import com.example.Loginregister.Model.Course;
import com.example.Loginregister.Repositries.UserRepository;
import com.example.Loginregister.Repositries.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class CourseController {
    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);
    private final CourseService courseService;
    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private String name;

    @Autowired
    public CourseController(CourseService courseService, AdminRepository adminRepository, UserRepository userRepository, CourseRepository courseRepository, StudentRepository studentRepository) {
        this.courseService = courseService;
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
    }
    @PostMapping("/add-course")
    public ResponseEntity<Course> addCourse(@RequestBody Course course) {
        Course savedCourse = courseService.saveCourse(course);
        return new ResponseEntity<>(savedCourse, HttpStatus.CREATED);
    }
    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getCoursesByInstituteKey(@RequestParam String email) {
        Admin admin = adminRepository.findByEmail(email);
        if (admin != null) {
            List<Course> courses = courseService.getCoursesByInstituteKey(admin.getInstituteKey());
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    @GetMapping("/courses/user")
    public ResponseEntity<List<Course>> getCoursesInstituteKey(@RequestParam String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            List<Course> courses = courseService.getCoursesByInstituteKey(user.getInstituteKey());
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    @GetMapping("/courses/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable String id) {
        Optional<Course> courseOptional = Optional.ofNullable(courseService.getCourseById(id));
        return courseOptional.map(course -> new ResponseEntity<>(course, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    @DeleteMapping("/courses/{courseId}")
    public ResponseEntity<Void> deleteCourse(@PathVariable String courseId) {
        courseService.deleteCourseById(courseId);
        logger.info("Course deleted successfully:", courseId);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/courses/{courseId}")
    public ResponseEntity<Course> updateCourse(@PathVariable String courseId, @RequestBody Course updatedCourse) {
        Course course = courseService.updateCourse(courseId, updatedCourse);
        if (course != null) {
            return ResponseEntity.ok(course);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/getFaculty")
    public List<Faculty> getAllFaculty() {
        return courseService.getAllFaculty();
    }
}
