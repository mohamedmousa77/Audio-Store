import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApi} from '../services/auth-api';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class  LoginForm implements OnInit {
private fb = inject(FormBuilder);
  private authService = inject(AuthApi);
  private router = inject(Router);

  loginForm!: FormGroup;
  loading = false;
  error = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['admin@audiostore.com', [Validators.required, Validators.email]],
      password: ['password', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = false;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.error = true;
        this.errorMessage = 'Invalid credentials. Please check your email and password.';
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
