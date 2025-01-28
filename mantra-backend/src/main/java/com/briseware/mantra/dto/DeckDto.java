package com.briseware.mantra.dto;

import lombok.Data;

import java.util.List;

@Data
public class DeckDto {
    private Long id;
    private String name;
    private String description;
    private List<CardDto> cards;
}
