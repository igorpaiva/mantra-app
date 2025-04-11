package com.briseware.mantra.service;

import com.briseware.mantra.dto.CardDto;
import com.briseware.mantra.dto.DeckDto;
import com.briseware.mantra.exception.ResourceNotFoundException;
import com.briseware.mantra.model.Card;
import com.briseware.mantra.model.Deck;
import com.briseware.mantra.repository.CardRepository;
import com.briseware.mantra.repository.DeckRepository;
import com.briseware.mantra.util.ModelMapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DeckServiceImpl implements DeckService {

    private final DeckRepository deckRepository;
    private final CardRepository cardRepository;
    private final CardService cardService;

    @Autowired
    public DeckServiceImpl(DeckRepository deckRepository, CardRepository cardRepository, CardService cardService) {
        this.deckRepository = deckRepository;
        this.cardRepository = cardRepository;
        this.cardService = cardService;
    }

    public List<DeckDto> getAll() {
        List<Deck> decks = deckRepository.findAll();
        List<DeckDto> deckDtoList = ModelMapperUtil.toList(decks, DeckDto.class);
        for (DeckDto deck : deckDtoList) {
            if (deck.getCards() != null) {
                deck.setCards(setCardsDtoDeckId(deck));
            }
        }
        return deckDtoList;
    }

    public DeckDto get(Long id) {
        Deck deck = deckRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No deck found with id: " + id));
        DeckDto deckDto = ModelMapperUtil.mapTo(deck, DeckDto.class);
        if (deck.getCards() != null) {
            deckDto.setCards(setCardsDtoDeckId(deckDto)); ;
        }
        return deckDto;
    }

    public DeckDto create(DeckDto deckDto) {
        Deck deck = ModelMapperUtil.mapTo(deckDto, Deck.class);
        Deck savedDeck = deckRepository.save(deck);
        if (deck.getCards() != null) {
            deckDto.setCards(setCardsDeck(savedDeck));
        }
        deckDto.setId(savedDeck.getId());
        return deckDto;
    }

    public DeckDto update(Long id, DeckDto deckDto) {
        Deck existingDeck = deckRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No deck found with id: " + id));
        deckDto.setId(existingDeck.getId());
        for (CardDto cardDto : deckDto.getCards()) {
            if (cardDto.getId() != null) {
                cardService.update(cardDto.getId(), cardDto);
            }
            else
            {
                Card newCard = ModelMapperUtil.mapTo(cardDto, Card.class);
                newCard.setDeck(existingDeck);
                cardService.createFromDeck(newCard);
            }
        }
        ModelMapperUtil.updateNonNullFields(deckDto, existingDeck);
        DeckDto returnDto = ModelMapperUtil.mapTo(deckRepository.save(existingDeck), DeckDto.class);
        returnDto.setCards(setCardsDtoDeckId(deckDto));
        return returnDto;
    }

    public void delete(Long id) {
        deckRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No deck found with id: " + id));
        deckRepository.deleteById(id);
    }

    public void deleteAll() {
        deckRepository.deleteAll();
    }

    private List<CardDto> setCardsDeck(Deck savedDeck) {
        List<CardDto> updatedCards = new ArrayList<>();
        for (Card card : savedDeck.getCards()) {
            card.setDeck(savedDeck);
            CardDto updatedCard = ModelMapperUtil.mapTo(cardRepository.save(card), CardDto.class);
            updatedCard.setDeck_id(savedDeck.getId());
            updatedCards.add(updatedCard);
        }
        return updatedCards;
    }

    private List<CardDto> setCardsDtoDeckId(DeckDto deckDto) {
        List<CardDto> updatedCards = new ArrayList<>();
        for (CardDto cardDto : deckDto.getCards()) {
            cardDto.setDeck_id(deckDto.getId());
            updatedCards.add(cardDto);
        }
        return updatedCards;
    }
}
