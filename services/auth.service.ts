// services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://api.your-backend.com/auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      this.getUserFromStorage()
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, { email, password })
      .pipe(
        tap(response => {
          this.storeAuthData(response);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  oauth2Login(provider: string): void {
    // Redireciona para o provedor OAuth2
    const state = this.generateState();
    localStorage.setItem('oauth_state', state);
    
    const params = new URLSearchParams({
      client_id: this.getClientId(provider),
      redirect_uri: `${window.location.origin}/oauth/callback`,
      response_type: 'code',
      state: state,
      scope: this.getScopes(provider)
    });

    window.location.href = `${this.getOAuthUrl(provider)}?${params.toString()}`;
  }

  handleOAuthCallback(code: string, state: string): Observable<AuthResponse> {
    const storedState = localStorage.getItem('oauth_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    return this.http.post<AuthResponse>(`${this.API_URL}/oauth/callback`, { code, state })
      .pipe(
        tap(response => {
          this.storeAuthData(response);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          this.storeAuthData(response);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue && !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private storeAuthData(response: AuthResponse): void {
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private getOAuthUrl(provider: string): string {
    const urls: { [key: string]: string } = {
      'rdstation': 'https://api.rd.services/auth/dialog',
      'pipedrive': 'https://oauth.pipedrive.com/oauth/authorize',
      'bling': 'https://www.bling.com.br/Api/v3/oauth/authorize'
    };
    return urls[provider] || '';
  }

  private getClientId(provider: string): string {
    const clientIds: { [key: string]: string } = {
      'rdstation': 'your-rdstation-client-id',
      'pipedrive': 'your-pipedrive-client-id',
      'bling': 'your-bling-client-id'
    };
    return clientIds[provider] || '';
  }

  private getScopes(provider: string): string {
    const scopes: { [key: string]: string } = {
      'rdstation': 'contacts+deals+companies',
      'pipedrive': 'deals:read+contacts:read',
      'bling': 'produtos.read+pedidos.read'
    };
    return scopes[provider] || '';
  }
}