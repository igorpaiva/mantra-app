package com.briseware.mantra.dto;

import com.briseware.mantra.model.Card;
import lombok.Data;

import java.util.List;

@Data
public class DeckDto {
    private long id;
    private String name;
    private String description;
//    private List<Card> cards;
}
