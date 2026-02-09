import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AuthServices } from '../../../core/services/auth/auth-services';
import { RegisterRequest } from '../../../core/models/user';
import { ErrorHandlingService } from '../../../core/services/error/error-handling.service';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/services/translation/translation.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnDestroy, OnInit {
  registrationForm!: FormGroup;
  loading = false;
  error: string | null = null;
  showPassword = false;
  showConfirmPassword = false;
  passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';
  emailAlreadyRegistered = false;
  agreedToTerms = false;

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
    this.registrationForm = this.createForm();
  }

  ngOnInit(): void {
    // Se già autenticato, vai a home
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/client/home']);
    }

    // Monitora il campo password per aggiornare la forza
    this.registrationForm
      .get('password')
      ?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((password) => {
        const result = this.authService.validatePassword(password);
        this.passwordStrength = result.strength;
      });

    // Monitora il campo email per verificare se già registrato
    this.registrationForm
      .get('email')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((email) => {
        if (email && this.authService.validateEmail(email)) {
          // Qui puoi aggiungere una chiamata API per verificare l'email
          // this.checkEmailExists(email);
          this.emailAlreadyRegistered = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Crea il form
   */
  private createForm(): FormGroup {
    return this.formBuilder.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: [
          '',
          [Validators.required, Validators.email],
          // Aggiungi AsyncValidator per email unique se necessario
        ],
        phone: ['', [Validators.required, this.phoneValidator]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        agreedToTerms: [false, [Validators.requiredTrue]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  /**
   * Validatore custom per numero di telefono
   */
  phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    // Accetta formati come +39, 0039, 039, etc.
    const phoneRegex = /^[\d\s\-+()]{9,}$/;
    return phoneRegex.test(control.value) ? null : { invalidPhone: true };
  }

  /**
   * Validatore custom per match password
   */
  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword && password === confirmPassword) {
      const errors = form.get('confirmPassword')?.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        if (Object.keys(errors).length === 0) {
          form.get('confirmPassword')?.setErrors(null);
        }
      }
    }

    return null;
  }

  /**
   * Invia il form di registrazione
   */
  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.markFormGroupTouched(this.registrationForm);
      return;
    }

    this.loading = true;
    this.error = null;
    this.errorService.clearError();

    const userData: RegisterRequest = {
      firstName: this.registrationForm.value.firstName,
      lastName: this.registrationForm.value.lastName,
      email: this.registrationForm.value.email,
      phoneNumber: this.registrationForm.value.phone,  // Map 'phone' to 'phoneNumber'
      password: this.registrationForm.value.password,
      confirmPassword: this.registrationForm.value.confirmPassword  // Add confirmPassword
    };

    this.authService
      .register(userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('✓ Registration successful:', response.user.email);
          this.loading = false;
          // Auto-login after registration, navigate based on role
          if (response.user.role === 'Admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/client/home']);
          }
        },
        error: (err) => {
          console.error('✗ Registration failed:', err);
          this.error = err.message || 'Registration failed. Please try again.';
          this.errorService.setError(this.error || 'Registration failed', err.status);

          // Check for specific error codes
          if (err.message?.includes('email') || err.message?.includes('already exists')) {
            this.emailAlreadyRegistered = true;
          }

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

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Toggle confirm password visibility
   */
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Naviga alla pagina di login
   */
  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  /**
   * Getter per controllare l'errore firstName
   */
  get firstNameError(): string | null {
    const control = this.registrationForm.get('firstName');
    if (control?.hasError('required')) return 'First name is required';
    if (control?.hasError('minlength')) return 'First name must be at least 2 characters';
    return null;
  }

  /**
   * Getter per controllare l'errore lastName
   */
  get lastNameError(): string | null {
    const control = this.registrationForm.get('lastName');
    if (control?.hasError('required')) return 'Last name is required';
    if (control?.hasError('minlength')) return 'Last name must be at least 2 characters';
    return null;
  }

  /**
   * Getter per controllare l'errore email
   */
  get emailError(): string | null {
    const control = this.registrationForm.get('email');
    if (control?.hasError('required')) return 'Email is required';
    if (control?.hasError('email')) return 'Enter a valid email';
    if (this.emailAlreadyRegistered) return 'This email is already registered';
    return null;
  }

  /**
   * Getter per controllare l'errore phone
   */
  get phoneError(): string | null {
    const control = this.registrationForm.get('phone');
    if (control?.hasError('required')) return 'Phone number is required';
    if (control?.hasError('invalidPhone')) return 'Enter a valid phone number';
    return null;
  }

  /**
   * Getter per controllare l'errore password
   */
  get passwordError(): string | null {
    const control = this.registrationForm.get('password');
    if (control?.hasError('required')) return 'Password is required';
    if (control?.hasError('minlength')) return 'Password must be at least 8 characters';
    return null;
  }

  /**
   * Getter per controllare l'errore confirmPassword
   */
  get confirmPasswordError(): string | null {
    const control = this.registrationForm.get('confirmPassword');
    if (control?.hasError('required')) return 'Please confirm your password';
    if (control?.hasError('passwordMismatch')) return 'Passwords do not match';
    return null;
  }

  /**
   * Getter per il messaggio di forza password
   */
  get passwordStrengthMessage(): string {
    return this.authService.getPasswordStrengthMessage(this.passwordStrength);
  }

  /**
   * Verifica se la password è forte
   */
  isPasswordStrong(): boolean {
    return this.passwordStrength === 'strong';
  }

}
