import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, Review, ReviewStats } from '../../services/api.service';
import { AnimateOnScrollDirective } from '../../directives/animate-on-scroll';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AnimateOnScrollDirective],
  templateUrl: './review.html',
  styleUrl: './review.scss'
})
export class ReviewComponent implements OnInit {
  reviews: Review[] = [];
  reviewForm: FormGroup;

  totalReviews = 0;
  averageRating = 0;
  
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.reviewForm = this.fb.group({
      name: ['', Validators.required],
      position: [''],
      company: [''],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadApprovedReviews();
    this.loadStats();
  }

   loadStats(): void {
    this.apiService.getReviewStats().subscribe((stats: ReviewStats) => {
      this.totalReviews = stats.totalReviews;
      this.averageRating = stats.averageRating;
      this.cdr.markForCheck();
    });
  }

  loadApprovedReviews(): void {
    this.apiService.getApprovedReviews().subscribe(data => {
      this.reviews = data;
      this.cdr.markForCheck();
    });
  }

  onReviewSubmit(): void {
    this.reviewForm.markAllAsTouched();
    if (this.reviewForm.invalid) {
      return;
    }

    this.apiService.createReview(this.reviewForm.value).subscribe({
      next: (newReview) => {
        // If the review was auto-approved, add it to the list instantly
        if (newReview.is_approved) {
          this.reviews.unshift(newReview);
        }
        this.successMessage = "Thank you! Your review has been submitted.";
        this.reviewForm.reset();
        this.cdr.markForCheck();
        setTimeout(() => {
          this.successMessage = null;
          this.cdr.markForCheck(); // Manually trigger update to hide message
        }, 2000);
        this.loadStats();
      },
      error: (err) => {
        this.errorMessage = "Sorry, something went wrong. Please try again.";
        console.error('Failed to submit review:', err);
        this.cdr.markForCheck(); // 2. Trigger change detection
        setTimeout(() => {
          this.errorMessage = null;
          this.cdr.markForCheck(); // 2. Trigger change detection
        }, 2000);
      }
    });
  }
}