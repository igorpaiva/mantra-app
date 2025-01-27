package com.briseware.mantra.controller;

import com.briseware.mantra.dto.CardDto;
import com.briseware.mantra.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/card")
public class CardController {
    @Autowired
    private CardService cardService;

    @GetMapping
    public List<CardDto> getAll() {
        return cardService.getAll();
    }

    @GetMapping("/{id}")
    public CardDto getById(@PathVariable(value = "id") Long id) {
        return cardService.get(id);
    }

    @PutMapping("/{id}")
    public CardDto update(@PathVariable(value = "id") Long id, @RequestBody CardDto cardDto) {
        return cardService.update(id, cardDto);
    }

    @PostMapping
    public CardDto create(@RequestBody CardDto cardDto) {
        return cardService.create(cardDto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable(value = "id") Long id) {
        cardService.delete(id);
    }

    @DeleteMapping
    public void deleteAll() {
        cardService.deleteAll();
    }
}
