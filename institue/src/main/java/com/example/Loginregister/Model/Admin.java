package com.example.Loginregister.Model;

import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Entity;

@Entity
@Document(collection = "Admin")
public class Admin {
    private String email;
    private String password;
    private String userType;
    private String instituteKey;

    // Default constructor
    public Admin() {
    }

    // Constructor with parameters
    public Admin(String email, String password, String userType, String instituteKey) {
        this.email = email;
        this.password = password;
        this.userType = userType;
        this.instituteKey = instituteKey;
    }

    // Getter and setter methods for all properties

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

    public String getInstituteKey() {
        return instituteKey;
    }

    public void setInstituteKey(String instituteKey) {
        this.instituteKey = instituteKey;
    }
}
