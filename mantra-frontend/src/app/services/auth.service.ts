import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSignal = signal<boolean>(false);
  private userEmailSignal = signal<string | null>(null);

  // Getters públicos (readonly)
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  userEmail = this.userEmailSignal.asReadonly();

  constructor(private router: Router) {
    // Verifica se há autenticação salva no localStorage
    this.checkStoredAuth();
  }

  private checkStoredAuth() {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const email = localStorage.getItem('userEmail');
    
    this.isAuthenticatedSignal.set(isAuth);
    this.userEmailSignal.set(email);
  }

  login(email: string): void {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    
    this.isAuthenticatedSignal.set(true);
    this.userEmailSignal.set(email);
  }

  logout(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    
    this.isAuthenticatedSignal.set(false);
    this.userEmailSignal.set(null);
    
    this.router.navigate(['/login']);
  }

  // Método helper para verificar autenticação (para guards)
  checkAuth(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
}
