package com.briseware.mantra.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private int cardNumber;
    private String term;
    private String definition;
}
