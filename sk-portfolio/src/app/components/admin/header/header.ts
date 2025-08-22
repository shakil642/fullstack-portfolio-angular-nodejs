import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  // This will send an event to the parent layout when the button is clicked
  @Output() sidebarToggled = new EventEmitter<void>();
  @Input() isMobile = false;
  isDropdownOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleSidebar(): void {
    this.sidebarToggled.emit();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
