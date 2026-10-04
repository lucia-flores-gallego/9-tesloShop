import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/userInterface';
import { AuthResponse } from '../interfaces/authResponseInterface';
import { RegisterPage } from '../pages/registerPage/registerPage';

const baseURL = environment.baseURL;

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  router = inject(Router);
  

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User|null>(null);
  private _token = signal<string|null>(null);

  authStatus = computed<AuthStatus>(() => {
    if(this._authStatus() === 'checking') return 'checking';
    if(this._user()){ return 'authenticated';}
    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(() => this._token());

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseURL}/auth/login`, {
            email: email,
            password: password,
      })
      .pipe(
        map(response => this.handleAuthSuccess(response)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth/login');
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http
      .get<AuthResponse>(`${baseURL}/auth/check-status`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        map(response => this.handleAuthSuccess(response)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${baseURL}/auth/register`, {
        name,
        email,
        password,
    });
 }

 private handleAuthSuccess({token, user}: AuthResponse){
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);
    localStorage.setItem('token', token);
    return true;
 }

 private handleAuthError(error: any){
    this.logout();
    return of (false);
 }

}