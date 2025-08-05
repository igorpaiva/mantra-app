package com.briseware.mantra.service;

import com.briseware.mantra.model.User;
import com.github.benmanes.caffeine.cache.Cache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TrialService {

    @Autowired
    private Cache<String, String> trialUserCache;

    @Autowired
    private AuthorizationService authorizationService;

    public User generateTrialUser() {
        String login = "trial_" + UUID.randomUUID().toString().substring(0, 8);
        String password = UUID.randomUUID().toString().substring(0, 8);

        User user = new User();
        user.setLogin(login);
        user.setPassword(password);

        return user;
    }

    @Scheduled(fixedRate = 30 * 60 * 1000)
    public void cleanExpiredTrialUsers() {
        List<User> trialUsers = authorizationService.findAllTrialUsers();

        for (User user : trialUsers) {
            if (trialUserCache.getIfPresent(user.getLogin()) == null) {
                authorizationService.deleteUserByLogin(user.getLogin());
                System.out.println("Deleted expired trial user: " + user.getLogin());
            }
        }
    }
}