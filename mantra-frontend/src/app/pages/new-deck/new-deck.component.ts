import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { CreateDeckRequest } from '../../model/deck.type';
import { Card } from '../../model/card.type';
import { DeckService } from '../../services/deck.service';

@Component({
  selector: 'app-new-deck',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './new-deck.component.html',
  styleUrl: './new-deck.component.css'
})
export class NewDeckComponent {
  // Form data
  deckName: string = '';
  deckDescription: string = '';
  cards: Card[] = [];
  nextId = 1;
  isSubmitting = false;

  constructor(
    private router: Router,
    private deckService: DeckService,
    private snackBar: MatSnackBar
  ) { }

  addNewCard() {
    this.cards.push({
      id: this.nextId++,
      term: '',
      definition: ''
    });
  }

  removeCard(id: number) {
    this.cards = this.cards.filter(card => card.id !== id);
  }

  adjustTextareaHeight(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  prepareDeckForSubmission(): CreateDeckRequest {
    // Filter out empty cards and format according to backend requirements
    const formattedCards = this.cards
      .filter(card => card.term.trim() || card.definition.trim()) // Keep cards with at least term or definition
      .map((card, index) => ({
        cardNumber: index + 1,
        term: card.term.trim(),
        definition: card.definition.trim()
      }));

    return {
      name: this.deckName.trim(),
      description: this.deckDescription.trim(),
      cards: formattedCards
    };
  }

  createDeck() {
    if (!this.deckName.trim()) {
      this.snackBar.open('Please enter a deck name', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;
    const deckData = this.prepareDeckForSubmission();

    this.deckService.createDeck(deckData).subscribe({
      next: (createdDeck) => {
        this.snackBar.open('Deck created successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error creating deck:', error);
        this.isSubmitting = false;
        this.snackBar.open('Failed to create deck. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }
}