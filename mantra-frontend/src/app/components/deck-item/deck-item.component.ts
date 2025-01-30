import { Component, input } from '@angular/core';
import { Deck } from '../../model/deck.type';

@Component({
  selector: 'app-deck-item',
  imports: [],
  templateUrl: './deck-item.component.html',
  styleUrl: './deck-item.component.css'
})
export class DeckItemComponent {
  deck = input.required<Deck>();
}
