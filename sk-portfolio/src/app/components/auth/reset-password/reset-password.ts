import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  token: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    // Get the token from the URL as soon as the component loads
    this.token = this.route.snapshot.paramMap.get('token');
  }

  get password() { return this.resetPasswordForm.get('password'); }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.resetPasswordForm.markAllAsTouched();
    if (this.resetPasswordForm.invalid || !this.token) {
      if (!this.token) {
        this.errorMessage = "Invalid or missing reset token.";
      }
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    this.authService.resetPassword(this.token, this.password?.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message;
        this.cdr.markForCheck();

        // Redirect to login after a delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000); // 3-second delay
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'An error occurred. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }
}