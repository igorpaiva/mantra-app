package com.briseware.mantra.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    @ManyToOne
    @JoinColumn(name = "deck_id")
    @JsonBackReference
    private Deck deck;
}