package com.example.Loginregister.Controller;
import com.example.Loginregister.Model.Admin;
import com.example.Loginregister.Model.User;
import com.example.Loginregister.Repositries.AdminRepository;
import com.example.Loginregister.Repositries.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;

    public AdminController(AdminRepository adminRepository, UserRepository userRepository) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/register/user")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            userRepository.save(user);

            logger.info("User registration successful for UserType: {}", user.getUserType());
            return ResponseEntity.ok("Registration successful");
        } catch (Exception e) {
            logger.error("User registration failed for email: {}. Reason: {}", user.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed");
        }
    }


    @PostMapping("/register/admin")
    public ResponseEntity<String> registerAdmin(@RequestBody Admin admin) {
        // Admin registration logic
        adminRepository.save(admin);
        logger.info("Admin registration successful");
        return ResponseEntity.ok("Admin registration successful");
    }

    // Other methods...

    @GetMapping("/getAdmin")
    public ResponseEntity<String> getAdmin(@RequestParam String instituteKey) {
        // Check if the admin exists for the given instituteKey
        if (adminRepository.existsByInstituteKey(instituteKey)) {
            logger.info("Admin exists for instituteKey: {}", instituteKey);
            return ResponseEntity.ok("Admin exists");
        } else {
            logger.info("Admin not found for instituteKey: {}", instituteKey);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        logger.info("Received login request for email: {}", email);

        if (email != null && password != null) {
            // Check both User and Registration entities for a matching email
            User existingUser = userRepository.findByEmail(email);
            Admin existingRegistration = adminRepository.findByEmail(email);

            if (existingUser != null && existingUser.getPassword().equals(password)) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Login successful");
                response.put("userType", "user");
                logger.info("Login successful for email: {}", email);
                return ResponseEntity.ok(response);
            } else if (existingRegistration != null && existingRegistration.getPassword().equals(password)) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Login successful");
                response.put("userType", existingRegistration.getUserType());
                logger.info("Login successful for email: {}", email);
                return ResponseEntity.ok(response);
            } else {
                // Log a warning for login failure
                logger.warn("Login failed for email: {}", email);
            }
        } else {
            // Log a warning for invalid login request
            logger.warn("Invalid login request. Email or password is null.");
        }

        // Log a warning for general login failure
        logger.warn("Login failed for email: {}", email);

        // Prepare response for unsuccessful login
        Map<String, String> response = new HashMap<>();
        response.put("message", "Login failed");
        response.put("userType", "null");

        // Return unauthorized status
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
    @GetMapping("/api/admin")
    public ResponseEntity<Admin> getAdminDetails(@RequestParam String email) {
        try {
            Admin admin = adminRepository.findByEmail(email);
            if (admin != null) {
                logger.info("Admin details fetched successfully for email: {}", email);
                return ResponseEntity.ok(admin);
            } else {
                logger.warn("Admin details not found for email: {}", email);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error fetching admin details for email: {}. Reason: {}", email, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

//    @GetMapping("/api/user-details")
//    public User getUserDetailsByEmail(@RequestParam String email) {
//        return userRepository.findByEmail(email);
//    }
//@GetMapping("/api/user")
//public ResponseEntity<User> getUserDetails(@RequestParam String email) {
//    try {
//        User user = userRepository.findByEmail(email);
//        if (user != null) {
//            logger.info("user details fetched successfully for email: {}", email);
//            return ResponseEntity.ok(user);
//        } else {
//            logger.warn("user details not found for email: {}", email);
//            return ResponseEntity.notFound().build();
//        }
//    } catch (Exception e) {
//        logger.error("Error fetching admin details for email: {}. Reason: {}", email, e.getMessage());
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//    }
//}
}

