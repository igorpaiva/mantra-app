package com.briseware.mantra.service;

import com.briseware.mantra.model.User;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TrialService {

    public User generateTrialUser() {
        String login = "trial_" + UUID.randomUUID().toString().substring(0, 8);
        String password = UUID.randomUUID().toString().substring(0, 8);

        User user = new User();
        user.setLogin(login);
        user.setPassword(password);

        return user;
    }
}