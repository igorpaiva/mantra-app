import { Component, input } from '@angular/core';
import { Deck } from '../../model/deck.type';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-deck-item',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './deck-item.component.html',
  styleUrl: './deck-item.component.css'
})
export class DeckItemComponent {
  deck = input.required<Deck>();
}