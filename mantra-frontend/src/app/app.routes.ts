import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NewDeckComponent } from './pages/new-deck/new-deck.component';
import { StudyComponent } from './pages/study/study.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'new-deck', component: NewDeckComponent, canActivate: [authGuard] },
  { path: 'edit-deck/:id', component: NewDeckComponent, canActivate: [authGuard] },
  { path: 'study/:id', component: StudyComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];