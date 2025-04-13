import { Component, input } from '@angular/core';
import { Deck } from '../../model/deck.type';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deck-item',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './deck-item.component.html',
  styleUrl: './deck-item.component.css'
})
export class DeckItemComponent {
  deck = input.required<Deck>();

  constructor(private router: Router) { }

  onEdit() {
    this.router.navigate(['/edit-deck', this.deck().id]);
  }

  onStudy() {
    // TODO
    console.log('Study deck:', this.deck().id);
    // this.router.navigate(['/study', this.deck().id]);
  }
}