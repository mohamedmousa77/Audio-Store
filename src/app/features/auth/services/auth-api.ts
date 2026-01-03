import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalStorage } from '../../../core/services/local-storage';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorage);
  private router = inject(Router);
  private apiUrl = 'https://api.audiostore.com/auth';

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Mock authentication
    if (credentials.email === 'admin@audiostore.com' && credentials.password === 'password') {
      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token-12345',
        user: {
          id: '1',
          email: credentials.email,
          role: 'admin'
        }
      };
      
      return of(mockResponse).pipe(
        delay(1200),
        map(response => {
          this.localStorageService.setItem('authToken', response.token);
          this.localStorageService.setItem('userRole', response.user.role);
          this.localStorageService.setItem('currentUser', response.user);
          return response;
        })
      );
    }
    
    return throwError(() => new Error('Invalid credentials')).pipe(delay(1200));
  }

  logout(): void {
    this.localStorageService.removeItem('authToken');
    this.localStorageService.removeItem('userRole');
    this.localStorageService.removeItem('currentUser');
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!this.localStorageService.getItem('authToken');
  }

  getCurrentUser(): any {
    return this.localStorageService.getItem('currentUser');
  }

}
