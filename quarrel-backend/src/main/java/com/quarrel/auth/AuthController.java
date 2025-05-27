package com.quarrel.auth;

import com.quarrel.dto.AuthResponse;
import com.quarrel.dto.LoginRequest;
import com.quarrel.dto.RegisterRequest;
import com.quarrel.model.Role;
import com.quarrel.model.User;
import com.quarrel.repository.UserRepository;
import com.quarrel.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;

    // Constructeur explicite pour l'injection Spring
    public AuthController(UserRepository repo,
                          PasswordEncoder encoder,
                          JwtService jwtService,
                          AuthenticationManager authManager) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwtService = jwtService;
        this.authManager = authManager;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        String jwt = jwtService.generateToken(
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(), user.getPassword(), List.of(new SimpleGrantedAuthority("ROLE_USER"))
                )
        );

        return ResponseEntity.ok(new AuthResponse(jwt));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = repo.findByEmail(request.getEmail()).orElseThrow();
        String jwt = jwtService.generateToken(
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(), user.getPassword(), List.of(new SimpleGrantedAuthority("ROLE_USER"))
                )
        );

        return ResponseEntity.ok(new AuthResponse(jwt));
    }
}
