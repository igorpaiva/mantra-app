import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSignal = signal<boolean>(false);
  private userEmailSignal = signal<string | null>(null);
  private apiUrl = environment.apiUrl;

  isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  userEmail = this.userEmailSignal.asReadonly();

  constructor(private router: Router, private http: HttpClient) {
    this.checkStoredAuth();
  }

  private checkStoredAuth() {
    const token = localStorage.getItem('token');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const email = localStorage.getItem('userEmail');
    
    const hasValidAuth = Boolean(token && isAuth);
    
    this.isAuthenticatedSignal.set(hasValidAuth);
    this.userEmailSignal.set(hasValidAuth ? email : null);
  }


  async login({ login, password }: { login: string; password: string }): Promise<void> {
    try {
      const res: any = await this.http.post(`${this.apiUrl}/auth/login`, { login, password }).toPromise();
      localStorage.setItem('token', res.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', res.user?.login || login);
      this.isAuthenticatedSignal.set(true);
      this.userEmailSignal.set(res.user?.login || login);
    } catch (err) {
      throw err;
    }
  }

  async register({ login, password, role }: { login: string; password: string; role: string }): Promise<void> {
    try {
      await this.http.post(`${this.apiUrl}/auth/register`, { login, password, role }).toPromise();
    } catch (err) {
      throw err;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    
    this.isAuthenticatedSignal.set(false);
    this.userEmailSignal.set(null);
    
    this.router.navigate(['/login']);
  }

  checkAuth(): boolean {
    const token = localStorage.getItem('token');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    return Boolean(token && isAuth);
  }
}
