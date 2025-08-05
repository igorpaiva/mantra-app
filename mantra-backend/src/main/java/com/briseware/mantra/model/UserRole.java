package com.briseware.mantra.model;

public enum UserRole {
    ADMIN("admin"),
    USER("user"),
    TRIAL("trial");

    private final String role;

    UserRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}
