import { Component, input, EventEmitter, Output, inject } from '@angular/core';
import { Deck } from '../../model/deck.type';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DeckService } from '../../services/deck.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { extractErrorMessage, logError } from '../../utils/error-handler';

@Component({
  selector: 'app-deck-item',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './deck-item.component.html',
  styleUrl: './deck-item.component.css'
})
export class DeckItemComponent {
  deck = input.required<Deck>();
  @Output() deckDeleted = new EventEmitter<string>();

  private router = inject(Router);
  private dialog = inject(MatDialog);
  private deckService = inject(DeckService);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  get userName() {
    return this.authService.userEmail() || 'User';
  }

  onEdit() {
    this.router.navigate(['/edit-deck', this.deck().id]);
  }

  onStudy() {
    this.router.navigate(['/study', this.deck().id]);
  }

  onDelete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Deck',
        message: `Are you sure you want to delete the deck "${this.deck().name}"? This action CANNOT be undone!`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        isDestructive: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deckService.deleteDeck(String(this.deck().id)).subscribe({
          next: () => {
            this.snackBar.open('Deck deleted successfully', 'Close', { duration: 3000 });
            this.deckDeleted.emit(String(this.deck().id));
          },
          error: (error) => {
            logError('DeckItemComponent.deleteDeck', error);
            const errorMessage = extractErrorMessage(error);
            this.snackBar.open(errorMessage, 'Close', { duration: 4000 });
          }
        });
      }
    });
  }
}