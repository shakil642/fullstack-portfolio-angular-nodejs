import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Import ActivatedRoute
import { ApiService, Blogs } from '../../services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.scss'
})
export class BlogPost implements OnInit {
  // Use an Observable to handle the async data
  blogPost$!: Observable<Blogs>;
  backendUrl = 'https://localhost:3000';

  constructor(
    private route: ActivatedRoute, 
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Read the 'slug' parameter from the URL
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      // Fetch the blog post using the slug
      this.blogPost$ = this.apiService.getBlogBySlug(slug);
    }
  }
}