package com.briseware.mantra.controller;

import com.briseware.mantra.dto.DeckDto;
import com.briseware.mantra.service.DeckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/deck")
public class DeckController {

    private final DeckService deckService;

    @Autowired
    public DeckController(DeckService deckService) {
        this.deckService = deckService;
    }

    @GetMapping
    public List<DeckDto> getAll() {
        return deckService.getAll();
    }

    @GetMapping("/{id}")
    public DeckDto get(@PathVariable(value = "id") Long id) {
        return deckService.get(id);
    }

    @PostMapping
    public DeckDto create(@RequestBody DeckDto deckDto) {
        return deckService.create(deckDto);
    }

    @PutMapping("/{id}")
    public DeckDto update(@PathVariable(value = "id") Long id, @RequestBody DeckDto deckDto) {
        return deckService.update(id, deckDto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable(value = "id") Long id) {
        deckService.delete(id);
    }

    @DeleteMapping
    public void deleteAll() {
        deckService.deleteAll();
    }
}
