package com.briseware.mantra.dto;

import com.briseware.mantra.model.UserRole;

public record RegisterDTO(String login, String password, String firstName, UserRole role) {
}
