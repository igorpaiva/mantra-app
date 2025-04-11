import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NewDeckComponent } from './pages/new-deck/new-deck.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'new-deck', component: NewDeckComponent },
];