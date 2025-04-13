import { Component, OnInit } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';

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

  isEditMode = false;
  deckId: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private deckService: DeckService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Check if we're in edit mode by looking for an ID parameter
    this.route.paramMap.subscribe(params => {
      this.deckId = params.get('id');

      if (this.deckId) {
        this.isEditMode = true;
        this.loadDeckForEditing(this.deckId);
      }
    });
  }

  loadDeckForEditing(id: string) {
    this.deckService.getDeck(id).subscribe({
      next: (deck) => {
        this.deckName = deck.name;
        this.deckDescription = deck.description;

        // Convert cards to our local format with IDs for tracking
        this.cards = deck.cards.map(card => ({
          id: card.id,
          term: card.term,
          definition: card.definition,
          deckId: deck.id
        }));
        console.log('Loaded deck for editing:', this.cards);
      },
      error: (error) => {
        console.error('Error loading deck for editing:', error);
        this.snackBar.open('Failed to load deck for editing', 'Close', { duration: 3000 });
        this.router.navigate(['/home']);
      }
    });
  }

  addNewCard() {
    this.cards.push({
      term: '',
      definition: '',
      deckId: this.isEditMode ? +this.deckId! : undefined // This will be set when the deck is created
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
        id: this.isEditMode ? card.id : undefined,
        cardNumber: index + 1,
        term: card.term.trim(),
        definition: card.definition.trim(),
        deckId: this.isEditMode ? card.deckId : undefined // Only set deckId if in edit mode
      }));

    return {
      name: this.deckName.trim(),
      description: this.deckDescription.trim(),
      cards: formattedCards
    };
  }

  saveDeck() {
    if (!this.deckName.trim()) {
      this.snackBar.open('Please enter a deck name', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;
    const deckData = this.prepareDeckForSubmission();

    // Choose whether to create or update based on edit mode
    const saveOperation = this.isEditMode && this.deckId
      ? this.deckService.updateDeck(this.deckId, deckData)
      : this.deckService.createDeck(deckData);

    saveOperation.subscribe({
      next: (result) => {
        const message = this.isEditMode ? 'Deck updated successfully!' : 'Deck created successfully!';
        this.snackBar.open(message, 'Close', { duration: 3000 });
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error(`Error ${this.isEditMode ? 'updating' : 'creating'} deck:`, error);
        this.isSubmitting = false;
        this.snackBar.open(`Failed to ${this.isEditMode ? 'update' : 'create'} deck. Please try again.`, 'Close', { duration: 3000 });
      }
    });
  }
}