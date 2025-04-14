import { Component, input, EventEmitter, Output } from '@angular/core';
import { Deck } from '../../model/deck.type';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DeckService } from '../../services/deck.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private deckService: DeckService,
    private snackBar: MatSnackBar
  ) { }

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
        // User confirmed deletion
        this.deckService.deleteDeck(String(this.deck().id)).subscribe({
          next: () => {
            this.snackBar.open('Deck deleted successfully', 'Close', { duration: 3000 });
            this.deckDeleted.emit(String(this.deck().id));
          },
          error: (error) => {
            console.error('Error deleting deck:', error);
            this.snackBar.open('Failed to delete deck. Please try again.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}