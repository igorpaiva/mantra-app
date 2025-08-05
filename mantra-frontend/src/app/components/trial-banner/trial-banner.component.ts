import { Component, inject, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-trial-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    @if (authService.trialMode() && !isLoginPage()) {
      <div class="trial-banner">
        <div class="trial-content">
          <mat-icon>timer</mat-icon>
          <span class="trial-text">Trial Mode</span>
          <span class="timer">{{ timeRemaining() }}</span>
        </div>
        <button mat-button class="upgrade-btn" (click)="goToRegister()">
          Upgrade Now
        </button>
      </div>
    }
  `,
  styles: [`
    .trial-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(45deg, #ff9800, #ff5722);
      color: white;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 1000;
      box-shadow: 0 -2px 8px rgba(0,0,0,0.2);
      padding-bottom: max(12px, env(safe-area-inset-bottom));
    }
    
    .trial-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .trial-text {
      font-weight: 600;
      font-size: 14px;
    }
    
    .timer {
      background: rgba(255,255,255,0.2);
      padding: 4px 8px;
      border-radius: 12px;
      font-family: monospace;
      font-size: 12px;
      font-weight: bold;
    }
    
    .upgrade-btn {
      background: rgba(255,255,255,0.2);
      color: white;
      font-weight: 600;
      border-radius: 20px;
      padding: 0 16px;
      height: 32px;
      line-height: 32px;
      min-width: auto;
    }
    
    .upgrade-btn:hover {
      background: rgba(255,255,255,0.3);
    }
    
    mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  `]
})
export class TrialBannerComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  public authService = inject(AuthService);
  
  timeRemaining = signal('5:00');
  isLoginPageSignal = signal(false);
  private timer: any = null;
  private startTime: number = 0;
  
  constructor() {
    // React to trial mode changes
    effect(() => {
      if (this.authService.trialMode()) {
        this.initializeTimer();
      } else {
        this.stopTimer();
      }
    });
    
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isLoginPageSignal.set(event.url === '/login' || event.url === '/register');
    });
  }
  
  isLoginPage() {
    return this.isLoginPageSignal();
  }
  
  ngOnInit() {
    // Set initial login page state
    this.isLoginPageSignal.set(
      this.router.url === '/login' || this.router.url === '/register'
    );
    
    // Initial check
    if (this.authService.trialMode()) {
      this.initializeTimer();
    }
  }
  
  ngOnDestroy() {
    this.stopTimer();
  }
  
  private initializeTimer() {
    // Don't start multiple timers
    if (this.timer) return;
    
    let trialStartTime = localStorage.getItem('trialStartTime');
    
    if (!trialStartTime) {
      // If no start time is saved, create one now
      trialStartTime = Date.now().toString();
      localStorage.setItem('trialStartTime', trialStartTime);
    }
    
    this.startTime = parseInt(trialStartTime);
    this.startTimer();
  }
  
  private stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  
  private startTimer() {
    // Update immediately first
    this.updateTimer();
    
    this.timer = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }
  
  private updateTimer() {
    const elapsed = Date.now() - this.startTime;
    const totalTime = 5 * 60 * 1000; // 5 minutes
    const remaining = Math.max(0, totalTime - elapsed);
    
    if (remaining === 0) {
      this.timeRemaining.set('0:00');
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      return;
    }
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    this.timeRemaining.set(timeString);
  }
  
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
