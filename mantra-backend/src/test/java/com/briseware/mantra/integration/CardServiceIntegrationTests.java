package com.briseware.mantra.integration;

import com.briseware.mantra.dto.CardDto;
import com.briseware.mantra.model.Card;
import com.briseware.mantra.repository.CardRepository;
import com.briseware.mantra.service.CardService;
import com.briseware.mantra.util.ModelMapperUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class CardServiceIntegrationTests {

    @Autowired
    private CardService cardService;

    @Autowired
    private CardRepository cardRepository;

    @Test
    public void testCreateAndRetrieveCard() {
        Card card = new Card();
        card.setCardNumber(5);
        card.setTerm("Term 5");
        card.setDefinition("Definition 5");

        CardDto savedCard = cardService.create(ModelMapperUtil.mapTo(card, CardDto.class));

        assertNotNull(savedCard);

        CardDto retrievedCard = cardService.get(savedCard.getId());

        assert retrievedCard.getTerm().equals("Term 5");
    }
}