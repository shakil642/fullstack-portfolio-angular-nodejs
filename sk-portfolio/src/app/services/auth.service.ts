import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Import isPlatformBrowser
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private apiUrl = 'https://localhost:3000/api/auth';
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'portfolio-auth-token';

  // Inject PLATFORM_ID to determine the environment
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  login(credentials: {email: string, password: string}): Observable<{token: string}> {
    return this.http.post<{token: string}>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Only use localStorage if in the browser
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      })
    );
  }

  forgotPassword(email: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/reset-password/${token}`, { password });
  }

  logout(): void {
    // Only use localStorage if in the browser
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  getToken(): string | null {
    // Only use localStorage if in the browser
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null; // Return null if on the server
  }

  isLoggedIn(): boolean {
    // Only use localStorage if in the browser
    if (isPlatformBrowser(this.platformId)) {
      return !!this.getToken();
    }
    return false; // Assume not logged in if on the server
  }
}