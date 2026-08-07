import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth-service';
import { ToastComponent } from '../../../../layout/toast/toast';
import { ToastService } from '../../../../layout/toast/toast.service';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ToastComponent],
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent {
  signupForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  private toastService = inject(ToastService);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
  name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  password: ['', Validators.required],
  phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
  role: ['Patient', Validators.required] 
});
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.toastService.showToast('info', 'Validation Error', 'Please complete all required fields correctly.');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      ...this.signupForm.value,
      phone: Number(this.signupForm.value.phone)
    };

    this.authService.signup(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastService.showToast('success', 'Registration Successful', 'Registration successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Signup Error:', err);

        if (err.error && typeof err.error.message === 'string') {
          this.errorMessage = err.error.message;
        } else if (err.status === 400) {
          this.errorMessage = 'Invalid input details. Please check email and 10-digit phone number.';
        } else if (err.status === 409) {
          this.errorMessage = 'User with this email already exists!';
        } else {
          this.errorMessage = 'Registration failed. Please try again later.';
        }

        this.toastService.showToast('error', 'Registration Failed', this.errorMessage);
      }
    });
  }
}