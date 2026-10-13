package com.nexus.erp.controller;

import com.nexus.erp.dto.AuthDTOs.*;
import com.nexus.erp.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Week 5 & 6: Authentication & Registration REST Controller
 * Provides /api/auth/login and /api/auth/register
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // POST /api/auth/login -> Issues JWT token upon valid credentials
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    // POST /api/auth/register -> Registers new user with encrypted password
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        String message = authService.register(registerRequest);
        return new ResponseEntity<>(message, HttpStatus.CREATED);
    }
}
