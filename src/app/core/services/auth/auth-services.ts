import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, User} from '../../models/user'
import { BaseApiServices } from '../api/api-services';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthServices extends BaseApiServices {
  private readonly endpoint = API_ENDPOINTS.auth;
  
  // Stato reattivo dell'utente corrente
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // --- LOGICA DI ACCESSO ---

  // Effettua il login e salva il token JWT
  login(credentials: { email: string, password: string }): Observable<AuthResponse> {
    
    return this.http.post<AuthResponse>(this.buildUrl(`${this.endpoint}/login`), credentials)
    .pipe(
      // tap(response => this.handleAuthentication(response))
      map((response) => {
          this.setUser(response.user, response.token, response.expiresIn);
          return response;
        }),
        catchError((error) => {
          console.error('Login error:', error);
          throw error;
        })

    );
  }

  // Registrazione nuovo cliente
  register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.buildUrl(`${this.endpoint}/register`), userData)
    .pipe(
      // tap(response => this.handleAuthentication(response))
      map((response) => {
        this.setUser(response.user, response.token, response.expiresIn);
        return response;
      }),
      catchError((error) => {
        console.error('Registration error:', error);
        throw error;
      })

    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_expiry');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  // --- HELPER DI STATO ---

  // public get isLoggedIn(): boolean {
  //   return !!this.currentUserSubject.value && !!localStorage.getItem('token');
  // }

  // // Verifica se l'utente ha i privilegi di Admin
  // public get isAdmin(): boolean {
  //   return this.currentUserSubject.value?.ruole === 'Admin';
  // }

  // public getToken(): string | null {
  //   return localStorage.getItem('token');
  // }

  // // --- LOGICA PRIVATA ---

  // private handleAuthentication(response: AuthResponse): void {
  //   localStorage.setItem('token', response.token);
  //   localStorage.setItem('user', JSON.stringify(response.user));
  //   this.currentUserSubject.next(response.user);
  // }

  // private getUserFromStorage(): User | null {
  //   const userJson = localStorage.getItem('user');
  //   return userJson ? JSON.parse(userJson) : null;
  // }

  /**
   * Imposta l'utente corrente
   */
  private setUser(user: User, token: string, expiresIn: number): void {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('auth_token', token);
    localStorage.setItem('token_expiry', (Date.now() + expiresIn * 1000).toString());

    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    console.log('✓ User authenticated:', user.email);
  }

  /**
   * Carica l'utente da localStorage
   */
  private loadUserFromLocalStorage(): void {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');
    const expiry = localStorage.getItem('token_expiry');

    if (user && token && expiry) {
      if (Date.now() < parseInt(expiry)) {
        this.currentUserSubject.next(JSON.parse(user));
        this.isAuthenticatedSubject.next(true);
      } else {
        this.logout();
      }
    }
  }

  /**
   * Ottiene il token corrente
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Ottiene l'utente corrente
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica se è autenticato
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Valida l'email
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida la password (almeno 8 caratteri, 1 maiuscola, 1 numero)
   */
  validatePassword(password: string): { valid: boolean; strength: 'weak' | 'medium' | 'strong' } {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);

    const strength =
      hasUppercase && hasNumber && hasSpecial ? 'strong' : hasUppercase && hasNumber ? 'medium' : 'weak';

    return {
      valid: minLength && hasUppercase && hasNumber,
      strength,
    };
  }

  /**
   * Ottiene il messaggio di forza password
   */
  getPasswordStrengthMessage(strength: 'weak' | 'medium' | 'strong'): string {
    const messages = {
      weak: 'Weak',
      medium: 'Medium strength',
      strong: 'Strong',
    };
    return messages[strength];
  }
  
}
