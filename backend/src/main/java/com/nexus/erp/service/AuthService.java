package com.nexus.erp.service;

import com.nexus.erp.dto.AuthDTOs.*;
import com.nexus.erp.model.Role;
import com.nexus.erp.model.User;
import com.nexus.erp.repository.UserRepository;
import com.nexus.erp.security.JwtTokenProvider;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Week 5 & 6: Authentication Service
 * Manages user registration, BCrypt password hashing, and JWT token issuance
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    // Pre-seed default Admin and Staff accounts for immediate testing
    @PostConstruct
    public void initDefaultUsers() {
        if (!userRepository.existsByUsername("admin")) {
            userRepository.save(new User(
                    "admin",
                    "admin@nexus.com",
                    passwordEncoder.encode("password123"),
                    Role.ROLE_ADMIN
            ));
        }
        if (!userRepository.existsByUsername("staff")) {
            userRepository.save(new User(
                    "staff",
                    "staff@nexus.com",
                    passwordEncoder.encode("password123"),
                    Role.ROLE_USER
            ));
        }
    }

    public JwtResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = tokenProvider.generateToken(user.getUsername(), user.getRole().name());
        return new JwtResponse(token, user.getUsername(), user.getEmail(), user.getRole().name());
    }

    public String register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already in use");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Role role = "ROLE_ADMIN".equalsIgnoreCase(request.getRole()) ? Role.ROLE_ADMIN : Role.ROLE_USER;

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role
        );
        userRepository.save(user);

        return "User registered successfully with role: " + role.name();
    }
}
