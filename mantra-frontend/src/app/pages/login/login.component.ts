import { Component, inject, OnDestroy } from '@angular/core';
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
export class LoginComponent implements OnDestroy {
  loginValue = '';
  password = '';
  hidePassword = true;
  isLoading = false;
  trialTimer: any = null;

  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  async login() {
    if (!this.loginValue || !this.password) {
      this.snackBar.open('Please fill in all fields', 'Close', { duration: 3000 });
      return;
    }
    this.isLoading = true;
    const isMobile = isStandalonePWA();
    try {
      await this.authService.login({ login: this.loginValue, password: this.password, isMobile });
      this.snackBar.open(`Welcome back, ${this.loginValue}!`, 'Close', { duration: 3000 });
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

  async startTrial() {
    this.isLoading = true;
    
    try {
      await this.authService.startTrial();
      
      this.snackBar.open('Welcome to your 5-minute trial!', 'Close', { 
        duration: 4000 
      });
      
      // Set 5-minute timer for trial expiration warning
      this.trialTimer = setTimeout(() => {
        this.handleTrialExpiration();
      }, 4.5 * 60 * 1000); // 4.5 minutes warning
      
      this.router.navigate(['/home']);
      
    } catch (err: any) {
      logError('LoginComponent.startTrial', err);
      const errorMessage = err.message || 'Failed to start trial. Please try again.';
      this.snackBar.open(errorMessage, 'Close', { 
        duration: 4000 
      });
    }
    
    this.isLoading = false;
  }

  private handleTrialExpiration() {
    this.snackBar.open('Your trial will expire soon. Consider signing up to continue!', 'Sign Up', { 
      duration: 30000 
    }).onAction().subscribe(() => {
      this.router.navigate(['/register']);
    });
  }

  ngOnDestroy() {
    if (this.trialTimer) {
      clearTimeout(this.trialTimer);
    }
  }
}
