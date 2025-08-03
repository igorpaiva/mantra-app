import { Component, inject, effect } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToolbarComponent, SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mantra-frontend';
  showNavigation = true;

  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    this.updateNavigationVisibility();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateNavigationVisibility(event.url);
      });

    effect(() => {
      const isAuth = this.authService.isAuthenticated();
      this.updateNavigationVisibility();
    });
  }

  private updateNavigationVisibility(url?: string) {
    const currentUrl = url || this.router.url;
    const isAuthenticated = this.authService.checkAuth();
    
    const isLoginRoute = currentUrl.includes('/login') || currentUrl === '/';
    this.showNavigation = isAuthenticated && !isLoginRoute;
  }
}