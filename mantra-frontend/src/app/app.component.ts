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
    // Escuta mudanças de rota para mostrar/esconder navegação
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showNavigation = !event.url.includes('/login');
      });

    // Reativo às mudanças no estado de autenticação
    effect(() => {
      const isAuth = this.authService.isAuthenticated();
      if (!isAuth && !this.router.url.includes('/login')) {
        this.showNavigation = false;
      }
    });
  }
}