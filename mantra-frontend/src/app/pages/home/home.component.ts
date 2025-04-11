import { Component, inject, OnInit, signal } from '@angular/core';
import { DeckService } from '../../services/deck.service';
import { Deck } from '../../model/deck.type';
import { catchError } from 'rxjs';
import { DeckItemComponent } from '../../components/deck-item/deck-item.component';

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
          console.error(error);
          throw error;
        })
      )
      .subscribe((decks) => {
        this.deckItems.set(decks);
      });
  }
}
