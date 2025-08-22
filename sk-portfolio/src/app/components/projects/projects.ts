import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Project } from '../../services/api.service'; 
import { AnimateOnScrollDirective } from '../../directives/animate-on-scroll';
import { LazyLoadDirective } from '../../directives/lazy-load';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective, LazyLoadDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects implements OnInit {
  
  backendUrl = 'https://localhost:3000'; 
  // A property to hold our projects, initialized as an empty array
  projects: Project[] = [];

  // Inject the ApiService into the component
  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  // The ngOnInit lifecycle hook runs when the component is first loaded
  ngOnInit(): void {
    this.apiService.getProjects().subscribe((data: Project[]) => {
      this.projects = data;
      this.cdr.markForCheck();
    });
  }
}