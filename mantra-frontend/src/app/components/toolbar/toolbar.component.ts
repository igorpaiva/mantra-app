import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterLink } from '@angular/router';
import { SidenavService } from '../../services/sidenav.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule, RouterLink],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  private sidenavService = inject(SidenavService);
  private authService = inject(AuthService);
  private router = inject(Router);

  get userEmail() {
    return this.authService.userEmail();
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  goToHome() {
    if (this.authService.checkAuth()) {
      this.router.navigate(['/home']);
    }
  }

  logout() {
    this.authService.logout();
  }
}