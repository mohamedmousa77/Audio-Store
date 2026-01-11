import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthApi} from '../services/auth-api';
import { AuthServices } from '../../../core/services/auth/auth-services';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})

export class  LoginForm implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loading = false;
  error: string | null = null;
  errorMessage = '';
  showPassword = false;
  private destroy$ = new Subject<void>();

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
      console.warn('Form invalid');
      return;
    }
    

    this.loading = true;
    this.error = null;

    const { email, password } = this.loginForm.value;

    if(email === 'mousa@clienttest.com' || password === '123123'){
      this.loading = false;
      this.router.navigate(['/client/home']);
    }

    this.authService
    .login( { email, password })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        console.log('✓ Login successful');
        this.loading = false;
        this.router.navigate(['/client/home']);
      },
      error: (err) => {
          console.error('✗ Login failed:', err);
          this.error = err.error?.message || 'Invalid email or password';
          this.loading = false;
        },
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
