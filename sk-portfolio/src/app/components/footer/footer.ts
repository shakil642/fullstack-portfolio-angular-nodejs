import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  scrollToTop(event: MouseEvent): void {
    event.preventDefault(); 
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
