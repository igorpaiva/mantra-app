package com.briseware.mantra.service;

import com.briseware.mantra.dto.DeckDto;

import java.util.List;

public interface DeckService {
    List<DeckDto> getAll();
    DeckDto get(Long id);
    DeckDto create(DeckDto deckDto);
    DeckDto createDemoDecks(DeckDto deckDto, String login);
    DeckDto update(Long id, DeckDto deckDto);
    void delete(Long id);
    void deleteAll();
}
