package com.example.Loginregister.Services;

import com.example.Loginregister.Repositries.CourseRepository;
import com.example.Loginregister.Model.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    @Autowired
    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public Course addCourse(Course course) {
        return courseRepository.save(course);
    }

    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<Course> getAllCoursesByAdmin(String instituteKey) {
        return courseRepository.findByInstituteKey(instituteKey);
    }

    public List<Course> getAllCoursesByInstituteKey(String instituteKey) {
        return courseRepository.findByInstituteKey(instituteKey);
    }

    public Course getCourseById(String id) {
        Optional<Course> courseOptional = courseRepository.findById(id);
        return courseOptional.orElse(null);
    }

    public List<Course> getCoursesByInstituteKey(String instituteKey) {
        return courseRepository.findByInstituteKey(instituteKey);
    }
    public void deleteCourseById(String courseId) {
        courseRepository.deleteById(courseId);
    }
    public Course updateCourse(String courseId, Course updatedCourse) {
        Optional<Course> optionalCourse = courseRepository.findById(courseId);
        if (optionalCourse.isPresent()) {
            Course existingCourse = optionalCourse.get();
            existingCourse.setName(updatedCourse.getName());
            existingCourse.setFees(updatedCourse.getFees());
            existingCourse.setDuration(updatedCourse.getDuration());
            existingCourse.setStrengthOfStudents(updatedCourse.getStrengthOfStudents());
            existingCourse.setAvailableSeats(updatedCourse.getAvailableSeats());
            existingCourse.setCourseId(updatedCourse.getCourseId());
            existingCourse.setInstituteKey(updatedCourse.getInstituteKey());
            existingCourse.setStartDate(updatedCourse.getStartDate());
            existingCourse.setEndDate(updatedCourse.getEndDate());
            existingCourse.setBatch(updatedCourse.getBatch());
            return courseRepository.save(existingCourse);
        } else {
            return null;
        }
    }
}
