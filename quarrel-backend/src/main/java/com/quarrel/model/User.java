package com.quarrel.model;

import jakarta.persistence.*;

@Entity
public class User {
    @Id
    @GeneratedValue
    private Long id;
    private String username;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    public User(Builder builder) {
        this.id = builder.id;
        this.username = builder.username;
        this.email = builder.email;
        this.password = builder.password;
        this.role = builder.role;
    }

    public User() {

    }

    public static Builder builder() {
        return new Builder();
    }

    public Long getId() {
        return id;
    }
    public String getUsername() {
        return username;
    }
    public String getEmail() {
        return email;
    }
    public String getPassword() {
        return password;
    }
    public Role getRole() {
        return role;
    }

    public static class Builder {
        private Long id;
        private String username;
        private String email;
        private String password;
        private Role role;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }
        public Builder username(String username) {
            this.username = username;
            return this;
        }
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        public Builder password(String password) {
            this.password = password;
            return this;
        }
        public Builder role(Role role) {
            this.role = role;
            return this;
        }

        public User build() {
            return new User(this);
        }
    }
}