import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, User} from '../../models/user'
import { BaseApiServices } from '../api/api-services';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class AuthServices extends BaseApiServices {
  private readonly endpoint = API_ENDPOINTS.auth;
  
  // Stato reattivo dell'utente corrente
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  // --- LOGICA DI ACCESSO ---

  // Effettua il login e salva il token JWT
  login(credentials: { email: string, password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.buildUrl(`${this.endpoint}/login`), credentials).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  // Registrazione nuovo cliente
  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.buildUrl(`${this.endpoint}/register`), userData).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  // --- HELPER DI STATO ---

  public get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value && !!localStorage.getItem('token');
  }

  // Verifica se l'utente ha i privilegi di Admin
  public get isAdmin(): boolean {
    return this.currentUserSubject.value?.ruole === 'Admin';
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  // --- LOGICA PRIVATA ---

  private handleAuthentication(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
  
}
