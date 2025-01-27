package com.briseware.mantra.dto;

import lombok.Data;

@Data
public class CardDto {
    private long id;
    private String cardNumber;
    private String term;
    private String definition;
}
