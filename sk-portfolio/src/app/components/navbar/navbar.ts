import { Component, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar {
  isNavbarCollapsed = true;
  isAdminPage = false;
  isDropdownOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isAdminPage = event.urlAfterRedirects.startsWith('/admin');
        this.isDropdownOpen = false;
      });
  }

  toggleDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isDropdownOpen = !this.isDropdownOpen;
    this.cdr.detectChanges();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
      this.cdr.detectChanges();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    const ke = event as KeyboardEvent;
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
      this.cdr.detectChanges();
    }
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
