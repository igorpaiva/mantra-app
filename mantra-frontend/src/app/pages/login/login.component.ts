import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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

  login() {
    if (!this.email || !this.password) {
      this.snackBar.open('Please fill in all fields', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    // Mock login - qualquer email/senha funciona por enquanto
    setTimeout(() => {
      this.isLoading = false;
      
      // Usa o serviço de autenticação
      this.authService.login(this.email);
      
      this.snackBar.open(`Welcome back, ${this.email}!`, 'Close', { duration: 3000 });
      this.router.navigate(['/home']);
    }, 1500); // Simula delay de rede
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
