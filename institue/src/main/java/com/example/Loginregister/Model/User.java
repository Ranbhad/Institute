package com.example.Loginregister.Model;

import com.example.Loginregister.Model.Course;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String email;
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

    public User() {
    }

    public User(String id, String email, String password, String userType, String instituteKey) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.userType = userType;
        this.instituteKey = instituteKey;
    }
}
