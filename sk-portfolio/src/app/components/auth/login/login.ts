import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm: FormGroup;
  isLoading = false;
  apiErrorMessage: string | null = null;
  successMessage: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      // Renamed 'username' to 'email' and corrected validator array
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  // Updated getter
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.apiErrorMessage = null;
    this.successMessage = null;
    
    // Now sending 'email' and 'password'
    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Congratulations! You have successfully logged in.';
        this.cdr.markForCheck();
        setTimeout(() => {
          this.router.navigate(['/admin/dashboard']);
        }, 2000);
      },
      error: (err) => {
        this.apiErrorMessage = err.error.message || 'An unknown error occurred.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}