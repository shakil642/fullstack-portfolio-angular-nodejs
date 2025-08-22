import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Skills } from '../../services/api.service';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About implements OnInit {
  skills: Skills = {};

  // 3. Inject the ApiService
  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // 4. Fetch skills when the component loads
    this.apiService.getSkills().subscribe(data => {
      this.skills = data;
      this.cdr.markForCheck();
    });
  }

  // 5. Helper function to get the category names for the template
  getSkillCategories(): string[] {
    return Object.keys(this.skills);
  }
}
