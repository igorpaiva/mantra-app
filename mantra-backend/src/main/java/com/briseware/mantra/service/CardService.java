package com.briseware.mantra.service;

import com.briseware.mantra.dto.CardDto;
import com.briseware.mantra.exception.ResourceNotFoundException;
import com.briseware.mantra.model.Card;
import com.briseware.mantra.repository.CardRepository;
import com.briseware.mantra.util.ModelMapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CardService {

    @Autowired
    CardRepository cardRepository;

    public CardDto create(CardDto cardDto) {
        Card card = ModelMapperUtil.mapTo(cardDto, Card.class);
        return ModelMapperUtil.mapTo(cardRepository.save(card), CardDto.class);
    }

    public CardDto get(Long id) {
        Card retrievedCard = cardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID."));
        return ModelMapperUtil.mapTo(retrievedCard, CardDto.class);
    }

    public List<CardDto> getAll() {
        List<Card> retrievedCards = cardRepository.findAll();
        return ModelMapperUtil.toList(retrievedCards, CardDto.class);
    }

    public CardDto update(Long id, CardDto cardDto) {
        Card existingCard = cardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        return ModelMapperUtil.mapTo(cardRepository.save(existingCard), CardDto.class);
    }

    public void delete(Long id) {
        Card deleteCard = cardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));;
        cardRepository.delete(deleteCard);
    }
}
