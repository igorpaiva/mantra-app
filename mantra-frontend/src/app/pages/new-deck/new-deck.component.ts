import { Component, ViewChildren, QueryList, ElementRef, inject } from '@angular/core';
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
import { CardService } from '../../services/card.service';
import { ActivatedRoute } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { MatTooltipModule } from '@angular/material/tooltip';
import { extractErrorMessage, logError } from '../../utils/error-handler';

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
    MarkdownComponent,
    MatTooltipModule
  ],
  templateUrl: './new-deck.component.html',
  styleUrl: './new-deck.component.css'
})
export class NewDeckComponent {
  @ViewChildren('termTextarea') termTextareas!: QueryList<ElementRef>;
  @ViewChildren('definitionTextarea') definitionTextareas!: QueryList<ElementRef>;
  
  deckName = '';
  deckDescription = '';
  cards: Card[] = [];
  nextId = 1;
  isSubmitting = false;
  isEditMode = false;
  deckId: string | null = null;
  deletedCardIds: string[] = [];
  showPreviews = true;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cardService = inject(CardService);
  private deckService = inject(DeckService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
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

        this.cards = deck.cards.map(card => ({
          id: card.id,
          term: card.term,
          definition: card.definition,
          deckId: deck.id,
          cardNumber: card.cardNumber
        }));

        this.nextId = this.cards.length > 0
          ? Math.max(...this.cards.map(card => card.cardNumber || 0)) + 1
          : 1;
      },
      error: (error) => {
        logError('NewDeckComponent.loadDeckForEdit', error);
        const errorMessage = extractErrorMessage(error);
        this.snackBar.open(errorMessage, 'Close', { duration: 4000 });
        this.router.navigate(['/home']);
      }
    });
  }

  addNewCard() {
    const newCard: Card = {
      id: Date.now(),
      term: '',
      definition: '',
      cardNumber: this.nextId++,
      isNew: true,
      deckId: this.isEditMode ? +this.deckId! : undefined
    };

    this.cards = [...this.cards, newCard];
  }

  removeCard(id: number) {
    const cardToRemove = this.cards.find(card => card.id === id);

    if (cardToRemove && !cardToRemove.isNew && this.isEditMode) {
      this.deletedCardIds.push(cardToRemove.id!.toString());
      this.cardService.deleteCard(cardToRemove.id!.toString()).subscribe({
        error: (error) => {
          logError('NewDeckComponent.removeCard', error);
          const errorMessage = extractErrorMessage(error);
          this.snackBar.open(`Failed to delete card: ${errorMessage}`, 'Close', { duration: 4000 });
        }
      });
    }

    this.cards = this.cards.filter(card => card.id !== id);
  }

  adjustTextareaHeight(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  prepareDeckForSubmission(): CreateDeckRequest {
    const formattedCards = this.cards
      .filter(card => card.term.trim() || card.definition.trim())
      .map((card, index) => ({
        id: card.isNew ? undefined : card.id,
        cardNumber: index + 1,
        term: card.term.trim(),
        definition: card.definition.trim(),
        deckId: this.isEditMode ? card.deckId : undefined
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
        logError(`NewDeckComponent.${this.isEditMode ? 'updateDeck' : 'createDeck'}`, error);
        this.isSubmitting = false;
        const errorMessage = extractErrorMessage(error);
        this.snackBar.open(errorMessage, 'Close', { duration: 4000 });
      }
    });
  }

  togglePreviews() {
    this.showPreviews = !this.showPreviews;
  }

  private getTextarea(card: Card, field: 'term' | 'definition'): HTMLTextAreaElement | null {
    const textareas = field === 'term' ? this.termTextareas : this.definitionTextareas;
    const textareaIndex = this.cards.findIndex(c => c.id === card.id);
    return textareaIndex !== -1 ? textareas.toArray()[textareaIndex]?.nativeElement || null : null;
  }

  insertMarkdown(card: Card, field: 'term' | 'definition', prefix: string, suffix: string): void {
    const textarea = this.getTextarea(card, field);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = card[field].substring(start, end);

    card[field] = card[field].substring(0, start) + prefix + selectedText + suffix + card[field].substring(end);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = start + prefix.length + selectedText.length;
    });
  }

  insertList(card: Card, field: 'term' | 'definition', bulleted: boolean): void {
    const textarea = this.getTextarea(card, field);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = card[field].substring(start, end);

    const listItems = selectedText.split('\n').filter(line => line.trim()) || ['Item 1', 'Item 2', 'Item 3'];
    const formattedList = listItems
      .map((item, index) => bulleted ? `- ${item}` : `${index + 1}. ${item}`)
      .join('\n');

    card[field] = card[field].substring(0, start) + formattedList + card[field].substring(end);

    setTimeout(() => {
      textarea.focus();
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    });
  }
}