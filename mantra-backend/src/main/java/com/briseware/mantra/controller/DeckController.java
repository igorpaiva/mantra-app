package com.briseware.mantra.controller;

import com.briseware.mantra.dto.DeckDto;
import com.briseware.mantra.service.DeckService;
import com.briseware.mantra.util.ModelMapperUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/v1/deck")
public class DeckController {

    private final DeckService deckService;
    @Autowired
    private ObjectMapper objectMapper;

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

    @PostMapping("/upload-json")
    public DeckDto uploadDeckJson(@RequestParam("file") MultipartFile file) {
        try {
            String json = new String(file.getBytes(), StandardCharsets.UTF_8);
            DeckDto deckDto = objectMapper.readValue(json, DeckDto.class);
            return deckService.create(deckDto);
        } catch (IOException e) {
            throw new RuntimeException("Failed to process JSON file", e);
        }
    }
}
