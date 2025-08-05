import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    return next(authReq).pipe(
      catchError(error => {
        if (error.status === 401) {
          const isTrialMode = localStorage.getItem('isTrialMode') === 'true';
          
          // Clear auth data
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('isTrialMode');
          localStorage.removeItem('trialStartTime');
          
          if (isTrialMode) {
            snackBar.open('Your trial has expired. Sign up to continue using Mantra!', 'Sign Up', { 
              duration: 10000 
            }).onAction().subscribe(() => {
              router.navigate(['/register']);
            });
          } else {
            snackBar.open('Your session has expired. Please log in again.', 'Close', { 
              duration: 5000 
            });
          }
          
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
  
  return next(req);
};
