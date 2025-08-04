import { Component, inject } from '@angular/core';
import { isStandalonePWA } from '../../utils/pwa';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { logError } from '../../utils/error-handler';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  hidePassword = true;
  isLoading = false;

  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  async login() {
    if (!this.email || !this.password) {
      this.snackBar.open('Please fill in all fields', 'Close', { duration: 3000 });
      return;
    }
    this.isLoading = true;
    const isMobile = isStandalonePWA();
    try {
      await this.authService.login({ login: this.email, password: this.password, isMobile });
      this.snackBar.open(`Welcome back, ${this.email}!`, 'Close', { duration: 3000 });
      this.router.navigate(['/home']);
    } catch (err: any) {
      logError('LoginComponent.login', err);
      // The error message is already processed by AuthService
      const errorMessage = err.message || 'Authentication failed';
      this.snackBar.open(errorMessage, 'Close', { duration: 4000 });
    }
    this.isLoading = false;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
