import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchModal } from '../search-modal/search-modal'; // 1. Import

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, SearchModal], // 2. Add to imports
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero {
  showSearchModal = false; // 3. Add property

  toggleSearchModal(): void { // 4. Add method
    this.showSearchModal = !this.showSearchModal;
  }
}