import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError, timer } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { AppStore } from '../state/store.provider';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  permissions: string[];
  avatar?: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenPayload {
  sub: string;
  username: string;
  role: string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly appStore = inject(AppStore);
  
  private readonly tokenKey = 'auth_token';
  private readonly refreshTokenKey = 'refresh_token';
  private readonly userKey = 'user_data';
  
  private readonly currentUserSignal = signal<User | null>(null);
  private readonly isAuthenticatedSignal = signal<boolean>(false);
  private readonly isLoadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  
  private refreshTokenTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  
  readonly isAdmin = computed(() => {
    const user = this.currentUserSignal();
    return user?.role === 'admin' || user?.permissions.includes('admin:access');
  });

  constructor() {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    const token = this.getToken();
    const userData = this.getStoredUser();
    
    if (token && userData && !this.isTokenExpired(token)) {
      this.currentUserSignal.set(userData);
      this.isAuthenticatedSignal.set(true);
      this.startRefreshTokenTimer();
    } else {
      this.clearAuthData();
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    return this.performLogin(credentials).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
        this.isLoadingSignal.set(false);
      }),
      catchError(error => {
        this.isLoadingSignal.set(false);
        const errorMessage = this.extractErrorMessage(error);
        this.errorSignal.set(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private performLogin(credentials: LoginCredentials): Observable<AuthResponse> {
    const mockUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      username: credentials.username,
      email: `${credentials.username}@example.com`,
      role: credentials.username === 'admin' ? 'admin' : 'user',
      permissions: credentials.username === 'admin' 
        ? ['admin:access', 'orders:read', 'orders:write', 'analytics:view']
        : ['orders:read', 'orders:write'],
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${credentials.username}`,
      lastLogin: new Date().toISOString()
    };

    const mockResponse: AuthResponse = {
      user: mockUser,
      token: this.generateMockToken(mockUser),
      refreshToken: 'refresh_' + Math.random().toString(36).substr(2, 16),
      expiresIn: 3600
    };

    return timer(800).pipe(
      map(() => mockResponse)
    );
  }

  private generateMockToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      username: user.username,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000)
    }));
    const signature = btoa('mock_signature');
    return `${header}.${payload}.${signature}`;
  }

  logout(): void {
    this.clearAuthData();
    this.stopRefreshTokenTimer();
    this.appStore.logout();
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const currentUser = this.currentUserSignal();
    if (!currentUser) {
      return throwError(() => new Error('No user session'));
    }

    const newToken = this.generateMockToken(currentUser);
    const response: AuthResponse = {
      user: currentUser,
      token: newToken,
      refreshToken: 'refresh_' + Math.random().toString(36).substr(2, 16),
      expiresIn: 3600
    };

    return timer(300).pipe(
      map(() => {
        this.storeToken(response.token);
        this.storeRefreshToken(response.refreshToken);
        this.startRefreshTokenTimer();
        return response;
      })
    );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    this.storeToken(response.token);
    this.storeRefreshToken(response.refreshToken);
    this.storeUser(response.user);
    this.currentUserSignal.set(response.user);
    this.isAuthenticatedSignal.set(true);
    this.appStore.setAuthenticated(response.user);
    this.startRefreshTokenTimer();
  }

  private startRefreshTokenTimer(): void {
    this.stopRefreshTokenTimer();
    const token = this.getToken();
    if (!token) return;

    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return;

    const expiryTime = payload.exp * 1000;
    const timeout = expiryTime - Date.now() - 60000;
    
    if (timeout > 0) {
      this.refreshTokenTimeout = setTimeout(() => {
        this.refreshToken().subscribe({
          error: () => this.logout()
        });
      }, timeout);
    }
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey) || sessionStorage.getItem(this.refreshTokenKey);
  }

  private storeToken(token: string, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.tokenKey, token);
  }

  private storeRefreshToken(token: string, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.refreshTokenKey, token);
  }

  private getStoredUser(): User | null {
    const userData = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  private storeUser(user: User, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.userKey, JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.refreshTokenKey);
    sessionStorage.removeItem(this.userKey);
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return true;
    return Date.now() >= payload.exp * 1000;
  }

  private decodeToken(token: string): TokenPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  private extractErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    return 'An unexpected error occurred. Please try again.';
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserSignal();
    if (!user) return false;
    return user.permissions.includes(permission) || user.role === 'admin';
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSignal();
    if (!user) return false;
    return user.role === role;
  }

  updateProfile(updates: Partial<User>): Observable<User> {
    const currentUser = this.currentUserSignal();
    if (!currentUser) {
      return throwError(() => new Error('No authenticated user'));
    }

    const updatedUser = { ...currentUser, ...updates };
    return timer(500).pipe(
      map(() => {
        this.currentUserSignal.set(updatedUser);
        this.storeUser(updatedUser);
        this.appStore.setAuthenticated(updatedUser);
        return updatedUser;
      })
    );
  }
}