import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() { return this.forgotPasswordForm.get('email'); }

  onSubmit(): void {
    this.forgotPasswordForm.markAllAsTouched();
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    this.authService.forgotPassword(this.email?.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'An error occurred. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }
}
