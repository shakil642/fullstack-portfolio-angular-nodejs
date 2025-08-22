import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../components/admin/sidebar/sidebar';
import { Header } from '../../components/admin/header/header';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar, Header],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayout {
  isMobile = false;
  isSidebarOpenOnMobile = false;

  ngOnInit() {
    this.checkScreenWidth();
  }

  constructor() {
    this.checkScreenWidth();
  }

  // Listen for window resize to switch between mobile/desktop layouts
  @HostListener('window:resize')
  onResize() {
    this.checkScreenWidth();
  }

  private checkScreenWidth() {
    this.isMobile = window.innerWidth < 992;
    if (!this.isMobile) {
      this.isSidebarOpenOnMobile = false; // Close mobile overlay if screen gets larger
    }
  }

  // This is called by the header's hamburger button on mobile
  toggleSidebar(): void {
    if (this.isMobile) {
      this.isSidebarOpenOnMobile = !this.isSidebarOpenOnMobile;
    }
  }

  onSidebarItemClick(): void {
    if (this.isMobile) {
      this.isSidebarOpenOnMobile = false;
    }
  }
}
