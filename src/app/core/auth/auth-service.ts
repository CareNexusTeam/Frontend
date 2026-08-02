import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

import {
  AuthResponse,
  LoginRequest,
  SignupRequest
} from '../models/auth-models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL =
    'http://localhost:8082/api/v1/auth';

  constructor(
    private http: HttpClient
  ) { }

  login(
    credentials: LoginRequest
  ): Observable<AuthResponse> {

    return this.http
      .post<AuthResponse>(
        `${this.API_URL}/login`,
        credentials
      )
      .pipe(

        tap(response => {

          localStorage.setItem(
            'auth_token',
            response.token
          );

          localStorage.setItem(
            'user_id',
            response.userId.toString()
          );

          localStorage.setItem(
            'user_name',
            response.name
          );

          localStorage.setItem(
            'user_email',
            response.email
          );

          localStorage.setItem(
            'user_role',
            response.role
          );

        })

      );

  }

  signup(
    payload: SignupRequest
  ): Observable<any> {

    return this.http.post(
      `${this.API_URL}/register`,
      payload
    );

  }

  getToken(): string {

    return localStorage.getItem(
      'auth_token'
    ) || '';

  }

  getRole(): string {

    return localStorage.getItem(
      'user_role'
    ) || '';

  }

  getUserName(): string {

    return localStorage.getItem(
      'user_name'
    ) || '';

  }

  getEmail(): string {

    return localStorage.getItem(
      'user_email'
    ) || '';

  }

  isLoggedIn(): boolean {

    return !!this.getToken();

  }

  logout(): void {

    localStorage.clear();

  }

}