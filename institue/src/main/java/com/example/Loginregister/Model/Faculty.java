package com.example.Loginregister.Model;

import com.example.Loginregister.Model.Course;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
@Document(collection = "faculty")
public class Faculty {
    @Getter
    @Id
    private String id;
    private String email;
    private String name;
    private String password;
    private String userType;
    private String instituteKey;
    @OneToMany(mappedBy = "userDetails")
    private List<Course> courses;
    public String getId() {
        return id;
    }

    public String getInstituteKey() {
        return instituteKey;
    }

    public void setInstituteKey(String instituteKey) {
        this.instituteKey = instituteKey;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Faculty() {
    }

    public Faculty(String name,String id, String email, String password, String userType, String instituteKey) {
        this.name = name;
        this.id = id;
        this.email = email;
        this.password = password;
        this.userType = userType;
        this.instituteKey = instituteKey;

    }
}
