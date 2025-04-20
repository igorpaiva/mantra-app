import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';
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
  // Form data
  deckName: string = '';
  deckDescription: string = '';
  cards: Card[] = [];
  nextId = 1;
  isSubmitting = false;
  newCard: Card | null = null;

  isEditMode = false;
  deckId: string | null = null;

  deletedCardIds: string[] = [];

  showPreviews = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cardService: CardService,
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
        console.log('Loaded deck for editing:', this.cards);
      },
      error: (error) => {
        console.error('Error loading deck for editing:', error);
        this.snackBar.open('Failed to load deck for editing', 'Close', { duration: 3000 });
        this.router.navigate(['/home']);
      }
    });
  }

  generateUniqueId(): number {
    return Date.now();
  }

  addNewCard() {
    this.newCard = {
      id: this.generateUniqueId(), // Only used for local identification
      term: '',
      definition: '',
      cardNumber: this.nextId++,
      isNew: true,
      deckId: this.isEditMode ? +this.deckId! : undefined
    };

    this.cards = [...this.cards, this.newCard];
  }

  removeCard(id: number) {
    const cardToRemove = this.cards.find(card => card.id === id);

    console.log('Removing card:', cardToRemove);

    if (cardToRemove && !cardToRemove.isNew) {
      if (this.isEditMode) {
        this.deletedCardIds.push(cardToRemove.id!.toString());

        this.cardService.deleteCard(cardToRemove.id!.toString()).subscribe({
          next: () => {
            console.log(`Card ${cardToRemove.id?.toString()} deleted from server`);
          },
          error: (error) => {
            console.error('Error deleting card:', error);
            this.snackBar.open('Failed to delete card. It will be removed when you save the deck.', 'Close', { duration: 3000 });
          }
        });
      }
    }

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

  togglePreviews() {
    this.showPreviews = !this.showPreviews;
  }

  insertMarkdown(card: Card, field: 'term' | 'definition', prefix: string, suffix: string): void {
    // Get the textarea element
    const textareas = field === 'term' ? this.termTextareas : this.definitionTextareas;
    const textareaIndex = this.cards.findIndex(c => c.id === card.id);
    if (textareaIndex === -1) return;

    const textarea = textareas.toArray()[textareaIndex]?.nativeElement as HTMLTextAreaElement;
    if (!textarea) return;

    // Get current selection
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = card[field].substring(start, end);

    // Create the new text with markdown
    const newText = card[field].substring(0, start) +
      prefix + selectedText + suffix +
      card[field].substring(end);

    // Update model and selection
    card[field] = newText;

    // Set focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = start + prefix.length + selectedText.length;
    });
  }

  insertList(card: Card, field: 'term' | 'definition', bulleted: boolean): void {
    const textareas = field === 'term' ? this.termTextareas : this.definitionTextareas;
    const textareaIndex = this.cards.findIndex(c => c.id === card.id);
    if (textareaIndex === -1) return;

    const textarea = textareas.toArray()[textareaIndex]?.nativeElement as HTMLTextAreaElement;
    if (!textarea) return;

    // Get current selection
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = card[field].substring(start, end);

    // Create list from selection
    let listItems = selectedText.split('\n').filter(line => line.trim());
    if (listItems.length === 0) {
      // If nothing selected, insert a placeholder list
      listItems = ['Item 1', 'Item 2', 'Item 3'];
    }

    // Format the list
    const formattedList = listItems
      .map((item, index) => bulleted ? `- ${item}` : `${index + 1}. ${item}`)
      .join('\n');

    // Create the new text
    const newText = card[field].substring(0, start) +
      formattedList +
      card[field].substring(end);

    // Update model
    card[field] = newText;

    // Set focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    });
  }
}