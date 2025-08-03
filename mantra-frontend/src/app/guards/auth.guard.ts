import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  // Verifica se o usuário está autenticado
  const isAuthenticated = authService.checkAuth();
  
  if (isAuthenticated) {
    return true;
  } else {
    // Redireciona para login se não estiver autenticado
    router.navigate(['/login']);
    return false;
  }
};
