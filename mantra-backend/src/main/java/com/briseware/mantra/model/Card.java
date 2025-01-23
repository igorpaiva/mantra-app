package com.briseware.mantra.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @NotNull(message = "Card number field must not be null.")
    private int cardNumber;
    @NotNull(message = "Term field must not be null.")
    @NotBlank(message = "Term field must not be blank.")
    @NotEmpty(message = "Term field must not be empty.")
    private String term;
    private String definition;
//    @ManyToOne
//    private Deck deck;
}
