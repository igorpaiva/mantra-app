import { Component, signal, inject, OnDestroy } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidenavService } from '../../services/sidenav.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  private sidenavService = inject(SidenavService);
  isExpanded = signal(false);

  constructor() {
    this.sidenavService.onToggle
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.isExpanded.update(value => !value));
  }
}