import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Import RouterLink
import { ApiService, Blogs } from '../../services/api.service';
import { AnimateOnScrollDirective } from '../../directives/animate-on-scroll';
import { LazyLoadDirective } from '../../directives/lazy-load';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink, AnimateOnScrollDirective, LazyLoadDirective], // Add RouterLink
  templateUrl: './blog.html',
  styleUrl: './blog.scss'
})
export class Blog implements OnInit {
  blogs: Partial<Blogs[]> = [];
  backendUrl = 'https://localhost:3000'; // Base URL for images

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.apiService.getBlogs().subscribe(data => {
      this.blogs = data;
      this.cdr.markForCheck();
    });
  }
}