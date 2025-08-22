import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero/hero';
import { About } from '../about/about';
import { Projects } from '../projects/projects';
import { Blog } from '../blog/blog';
import { ReviewComponent } from '../review/review';
import { Contact } from '../contact/contact';
import { ApiService } from '../../services/api.service';
// import { Footer } from '../footer/footer';

@Component({
  selector: 'app-home',
  imports: [Hero, About, Projects, Blog, ReviewComponent, Contact],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit { // 3. Implement OnInit

  // 4. Inject the ApiService
  constructor(private apiService: ApiService) {} 

  ngOnInit(): void {
    // 5. Call the tracking method when the component loads
    this.apiService.trackVisit().subscribe({
      next: () => console.log('Visit tracked.'),
      error: (err) => console.error('Failed to track visit:', err)
    });
  }
}
