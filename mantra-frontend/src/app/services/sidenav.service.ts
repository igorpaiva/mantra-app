import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private toggleSidenav$ = new Subject<void>();
  
  toggle() {
    this.toggleSidenav$.next();
  }
  
  get onToggle() {
    return this.toggleSidenav$.asObservable();
  }
}