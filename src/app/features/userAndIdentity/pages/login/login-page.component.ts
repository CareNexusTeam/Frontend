import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth-service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login Error details:', err);

        // 1. Check backend error response string / message (e.g. Bad credentials)
        const serverErrorMsg = err.error?.message || err.error || err.message || '';
        const isBadCredentials = 
          typeof serverErrorMsg === 'string' && 
          serverErrorMsg.toLowerCase().includes('bad credential');

        // 2. Handle 500 status code with "Bad Credentials" or standard auth failure status codes (401, 400)
        if (isBadCredentials || err.status === 401 || err.status === 400) {
          this.errorMessage = 'Invalid email or wrong password!';
        } else if (err.status === 404) {
          this.errorMessage = 'User not registered. Please sign up first!';
        } else if (typeof err.error === 'string' && err.error.length > 0) {
          this.errorMessage = err.error;
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Invalid password or login failed. Please check your credentials.';
        }
      }
    });
  }
}