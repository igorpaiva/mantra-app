import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { logError } from '../../utils/error-handler';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.registerForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.registerForm.invalid) return;
    
    this.loading.set(true);
    this.error.set(null);
    
    const { login, password } = this.registerForm.value;
    
    try {
      await this.auth.register({ login, password, role: 'USER' });
      this.router.navigate(['/login']);
    } catch (err: any) {
      logError('RegisterComponent.onSubmit', err);
      // The error message is already processed by AuthService
      const errorMessage = err.message || 'Registration failed. Please try again.';
      this.error.set(errorMessage);
    }
    
    this.loading.set(false);
  }
}