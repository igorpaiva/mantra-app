import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DeckService } from '../../services/deck.service';
import { Card } from '../../model/card.type';
import { Deck } from '../../model/deck.type';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-study',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './study.component.html',
  styleUrl: './study.component.css',
  animations: [
    trigger('flipState', [
      state('front', style({
        transform: 'rotateY(0deg)'
      })),
      state('back', style({
        transform: 'rotateY(180deg)'
      })),
      transition('front => back', animate('400ms ease-out')),
      transition('back => front', animate('400ms ease-out'))
    ])
  ]
})
export class StudyComponent implements OnInit {

  deck = signal<Deck | null>(null);
  cards = signal<Card[]>([]);
  currentCardIndex = signal(0);
  isFlipped = signal(false);
  isLoading = signal(true);

  currentCard = computed(() => {
    const currentCards = this.cards();
    return currentCards.length > 0 ? currentCards[this.currentCardIndex()] : null;
  });

  isFirstCard = computed(() => this.currentCardIndex() === 0);
  isLastCard = computed(() => this.currentCardIndex() === this.cards().length - 1);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deckService: DeckService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const deckId = params.get('id');
      if (deckId) {
        this.loadDeck(deckId);
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  loadDeck(deckId: string) {
    this.isLoading.set(true);
    this.deckService.getDeck(deckId).subscribe({
      next: (deck) => {
        this.deck.set(deck);
        this.cards.set(deck.cards);
        this.isLoading.set(false);

        if (deck.cards.length === 0) {
          this.snackBar.open('This deck has no cards to study', 'Close', { duration: 3000 });
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        console.error('Error loading deck:', error);
        this.snackBar.open('Error loading deck', 'Close', { duration: 3000 });
        this.router.navigate(['/home']);
      }
    });
  }

  flipCard() {
    this.isFlipped.update(flipped => !flipped);
  }

  nextCard() {
    if (!this.isLastCard()) {
      this.currentCardIndex.update(index => index + 1);
      this.isFlipped.set(false); // Reset to front side
    }
  }

  previousCard() {
    if (!this.isFirstCard()) {
      this.currentCardIndex.update(index => index - 1);
      this.isFlipped.set(false); // Reset to front side
    }
  }

  restartDeck() {
    this.currentCardIndex.set(0);
    this.isFlipped.set(false);
  }

  returnHome() {
    this.router.navigate(['/home']);
  }
}