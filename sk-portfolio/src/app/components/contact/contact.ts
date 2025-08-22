import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact implements OnInit {
  contactForm!: FormGroup;
  
  // Properties for in-page notifications
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get message() { return this.contactForm.get('message'); }

  onSubmit(): void {
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    this.apiService.sendMessage(this.contactForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = "Thank you for your message! I'll get back to you shortly.";
        this.contactForm.reset();
        this.cdr.markForCheck();
        setTimeout(() => {
          this.successMessage = null;
          this.cdr.markForCheck();
        }, 2000); 
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = "Sorry, something went wrong. Please try again later.";
        console.error('Failed to send message:', err);
        this.cdr.markForCheck();
        setTimeout(() => {
          this.errorMessage = null;
          this.cdr.markForCheck();
        }, 5000);
      }
    });
  }
}