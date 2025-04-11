package com.briseware.mantra.service;

import com.briseware.mantra.dto.CardDto;
import com.briseware.mantra.model.Card;

import java.util.List;

public interface CardService {
    CardDto create(CardDto cardDto);
    CardDto createFromDeck(Card card);
    CardDto update(Long id, CardDto cardDto);
    CardDto get(Long id);
    List<CardDto> getAll();
    void delete(Long id);
    void deleteAll();
}
