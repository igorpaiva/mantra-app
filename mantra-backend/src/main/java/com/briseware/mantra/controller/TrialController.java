package com.briseware.mantra.controller;

import com.briseware.mantra.dto.DeckDto;
import com.briseware.mantra.model.Deck;
import com.briseware.mantra.model.User;
import com.briseware.mantra.model.UserRole;
import com.briseware.mantra.service.AuthorizationService;
import com.briseware.mantra.service.DeckService;
import com.briseware.mantra.service.TokenService;
import com.briseware.mantra.service.TrialService;
import com.briseware.mantra.util.ModelMapperUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v1/try")
public class TrialController {

    @Autowired
    private TrialService trialService;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private AuthorizationService authorizationService;

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

        Map<String, String> response = Map.of(
                "login", trialUser.getLogin(),
                "password", trialUser.getPassword(),
                "token", token
        );

        authorizationService.saveUser(trialUser);

        scheduler.schedule(() -> {
            authorizationService.deleteUserByLogin(trialUser.getLogin());
        }, 5, TimeUnit.MINUTES);

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