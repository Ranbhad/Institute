package com.example.Loginregister.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.Date;
import java.util.UUID;

@Document(collection = "courses")
public class Course {

    @Id
    private String id;
    private String name;
    private String fees;
    private String duration;
    private String batch;
    private String instituteKey;
    private int availableSeats;
    private String courseId;
    private String strengthOfStudents;
    @Getter
    private String facultyName;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    public Course() {
        this.courseId = UUID.randomUUID().toString();
    }

    public Course( String facultyName, String id, String name, String fees, String duration, String batch, String strengthOfStudents, String instituteKey) {
        this.id = id;
        this.name = name;
        this.fees = fees;
        this.duration = duration;
        this.batch = batch;
        this.strengthOfStudents = strengthOfStudents;
        this.instituteKey = instituteKey;
        this.courseId = UUID.randomUUID().toString();
        this.facultyName = facultyName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFees() {
        return fees;
    }

    public void setFees(String fees) {
        this.fees = fees;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getBatch() {
        return batch;
    }

    public void setBatch(String batch) {
        this.batch = batch;
    }

    public String getInstituteKey() {
        return instituteKey;
    }

    public void setInstituteKey(String instituteKey) {
        this.instituteKey = instituteKey;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getStrengthOfStudents() {
        return strengthOfStudents;
    }

    public void setFacultyName(String facultyName) {
        this.facultyName = facultyName;
    }

    public void setStrengthOfStudents(String strengthOfStudents) {
        this.strengthOfStudents = strengthOfStudents;
        if (strengthOfStudents != null && !strengthOfStudents.isEmpty()) {
            this.availableSeats = Integer.parseInt(strengthOfStudents);
        }
    }


    public void decrementAvailableSeats() {
        if (this.availableSeats > 0) {
            this.availableSeats--;
        }
    }

    public void incrementAvailableSeats() {
        this.availableSeats++;
    }
}
