import { Component, OnInit, signal, computed, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-study',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MarkdownComponent
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
export class StudyComponent implements OnInit, AfterViewInit {
  @ViewChild('flashcardElement', { static: false }) flashcardElement!: ElementRef;

  deck = signal<Deck | null>(null);
  cards = signal<Card[]>([]);
  currentCardIndex = signal(0);
  isFlipped = signal(false);
  isLoading = signal(true);
  private isSwipeInProgress = false;

  currentCard = computed(() => {
    const currentCards = this.cards();
    return currentCards.length > 0 ? currentCards[this.currentCardIndex()] : null;
  });

  isFirstCard = computed(() => this.currentCardIndex() === 0);
  isLastCard = computed(() => this.currentCardIndex() === this.cards().length - 1);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private deckService = inject(DeckService);
  private snackBar = inject(MatSnackBar);

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

  ngAfterViewInit() {
    setTimeout(() => {
      this.setupSwipeListeners();
    }, 100);
  }

  private setupSwipeListeners() {
    if (this.flashcardElement) {
      const element = this.flashcardElement.nativeElement;
      let startX = 0;
      let startY = 0;
      let startTime = 0;

      element.addEventListener('touchstart', (e: TouchEvent) => {
        if (this.isSwipeInProgress) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
      });

      element.addEventListener('touchend', (e: TouchEvent) => {
        if (this.isSwipeInProgress) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const deltaTime = endTime - startTime;

        if (deltaTime < 250 && Math.abs(deltaX) > 60 && Math.abs(deltaY) < 100) {
          this.isSwipeInProgress = true;
          
          if (deltaX > 0) {
            this.onSwipeRight();
          } else {
            this.onSwipeLeft();
          }
          
          setTimeout(() => {
            this.isSwipeInProgress = false;
          }, 300);
        }
      });

      let mouseStartX = 0;
      let mouseStartY = 0;
      let mouseStartTime = 0;
      let isMouseDown = false;

      element.addEventListener('mousedown', (e: MouseEvent) => {
        if (this.isSwipeInProgress) return;
        isMouseDown = true;
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;
        mouseStartTime = Date.now();
        e.preventDefault();
      });

      element.addEventListener('mouseup', (e: MouseEvent) => {
        if (!isMouseDown || this.isSwipeInProgress) return;
        isMouseDown = false;
        
        const endX = e.clientX;
        const endY = e.clientY;
        const endTime = Date.now();
        
        const deltaX = endX - mouseStartX;
        const deltaY = endY - mouseStartY;
        const deltaTime = endTime - mouseStartTime;

        if (deltaTime < 250 && Math.abs(deltaX) > 60 && Math.abs(deltaY) < 100) {
          this.isSwipeInProgress = true;
          
          if (deltaX > 0) {
            this.onSwipeRight();
          } else {
            this.onSwipeLeft();
          }
          
          setTimeout(() => {
            this.isSwipeInProgress = false;
          }, 300);
        }
      });

      element.addEventListener('mouseleave', () => {
        isMouseDown = false;
      });

    } else {
      setTimeout(() => {
        this.setupSwipeListeners();
      }, 500);
    }
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
        } else {
          setTimeout(() => {
            this.setupSwipeListeners();
          }, 100);
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
      this.isFlipped.set(false);
    }
  }

  previousCard() {
    if (!this.isFirstCard()) {
      this.currentCardIndex.update(index => index - 1);
      this.isFlipped.set(false);
    }
  }

  restartDeck() {
    this.currentCardIndex.set(0);
    this.isFlipped.set(false);
  }

  onSwipeLeft() {
    if (!this.isLastCard()) {
      this.nextCard();
    }
  }

  onSwipeRight() {
    if (!this.isFirstCard()) {
      this.previousCard();
    }
  }

  returnHome() {
    this.router.navigate(['/home']);
  }
}