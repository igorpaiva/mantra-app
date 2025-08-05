package com.briseware.mantra.controller;

import com.briseware.mantra.dto.DeckDto;
import com.briseware.mantra.model.User;
import com.briseware.mantra.model.UserRole;
import com.briseware.mantra.service.AuthorizationService;
import com.briseware.mantra.service.DeckService;
import com.briseware.mantra.service.TokenService;
import com.briseware.mantra.service.TrialService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.benmanes.caffeine.cache.Cache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

@RestController
@RequestMapping("/api/v1/try")
public class TrialController {

    @Autowired
    private TrialService trialService;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private AuthorizationService authorizationService;
    @Autowired
    private Cache<String, String> trialUserCache;

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    @Autowired
    private DeckService deckService;

    @PostMapping
    public ResponseEntity<Map<String, String>> createTrialToken() throws FileNotFoundException {

        ObjectMapper mapper = new ObjectMapper();

        User credentials = trialService.generateTrialUser();
        User trialUser = User.builder()
                .login(credentials.getLogin())
                .password(credentials.getPassword())
                .role(UserRole.TRIAL)
                .build();

        String token = tokenService.generateToken(trialUser, false);

        trialUserCache.put(trialUser.getLogin(), "active");

        Map<String, String> response = Map.of(
                "login", trialUser.getLogin(),
                "password", trialUser.getPassword(),
                "token", token
        );

        authorizationService.saveUser(trialUser);

        try {
            InputStream inputStream = getClass().getClassLoader().getResourceAsStream("demo-decks.json");
            List<DeckDto> demoDecks = mapper.readValue(inputStream, new TypeReference<List<DeckDto>>() {});
            for (DeckDto deck : demoDecks) {
                deckService.createDemoDecks(deck, trialUser.getLogin());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok(response);
    }
}