package com.example.Loginregister.Controller;

import com.example.Loginregister.Model.User;
import com.example.Loginregister.Repositries.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    private final UserRepository userRepository;

    public UserController( UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/api/user")
    public ResponseEntity<User> getUserDetails(@RequestParam String email) {
        try {
            User user = userRepository.findByEmail(email);
            if (user != null) {
                logger.info("user details fetched successfully for email: {}", email);
                return ResponseEntity.ok(user);
            } else {
                logger.warn("user details not found for email: {}", email);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error fetching admin details for email: {}. Reason: {}", email, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
