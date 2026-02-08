import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthServices } from '../../../core/services/auth/auth-services';
import { LoginRequest } from '../../../core/models/user';
import { ErrorHandlingService } from '../../../core/services/error/error-handling.service';
import { TranslationService } from '../../../core/services/translation/translation.service';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})

export class LoginForm implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loading = false;
  error: string | null = null;
  showPassword = false;
  private destroy$ = new Subject<void>();

  private errorService = inject(ErrorHandlingService);
  private translationService = inject(TranslationService);

  // Translations
  translations = this.translationService.translations;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthServices,
    private router: Router
  ) {
    this.loginForm = this.createForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/client/home']);
    }
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.loading = true;
    this.error = null;
    this.errorService.clearError();

    const credentials: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService
      .login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('✓ Login successful:', response.user.email);
          this.loading = false;
          // Navigate based on user role
          if (response.user.role === 'Admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/client/home']);
          }
        },
        error: (err) => {
          console.error('✗ Login failed:', err);
          this.error = err.message || 'Invalid email or password';
          this.errorService.setError(this.error || 'Login failed', err.status);
          this.loading = false;
        },
      });
  }

  /**
   * Mark all form fields as touched to show validation errors
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Naviga alla pagina di registrazione
   */
  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  /**
   * Getter per controllare l'errore email
   */
  get emailError(): string | null {
    const email = this.loginForm.get('email');
    if (email?.hasError('required')) return 'Email is required';
    if (email?.hasError('email')) return 'Enter a valid email';
    return null;
  }

  /**
   * Getter per controllare l'errore password
   */
  get passwordError(): string | null {
    const password = this.loginForm.get('password');
    if (password?.hasError('required')) return 'Password is required';
    if (password?.hasError('minlength')) return 'Password must be at least 8 characters';
    return null;
  }
}
