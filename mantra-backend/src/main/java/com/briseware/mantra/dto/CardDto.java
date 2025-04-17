package com.briseware.mantra.dto;

import lombok.Data;

@Data
public class CardDto {
    private Long id;
    private int cardNumber;
    private String term;
    private String definition;
    private Long deckId;
}
