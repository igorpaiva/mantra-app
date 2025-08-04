import { Component, inject, OnInit, signal } from '@angular/core';
import { DeckService } from '../../services/deck.service';
import { Deck } from '../../model/deck.type';
import { catchError } from 'rxjs';
import { DeckItemComponent } from '../../components/deck-item/deck-item.component';
import { extractErrorMessage, logError } from '../../utils/error-handler';

@Component({
  selector: 'app-home',
  imports: [DeckItemComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  deckService = inject(DeckService);
  deckItems = signal<Array<Deck>>([]);

  ngOnInit(): void {
    this.deckService.getDecks()
      .pipe(
        catchError((error) => {
          logError('HomeComponent.loadDecks', error);
          throw error;
        })
      )
      .subscribe((decks) => {
        this.deckItems.set(decks);
      });
  }

  onDeckDeleted(deckId: string) {
    this.deckItems.update(decks =>
      decks.filter(deck => String(deck.id) !== String(deckId))
    );
  }
}
