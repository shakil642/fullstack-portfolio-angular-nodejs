import { Component, signal, ViewChild } from '@angular/core';
import { RouterOutlet,Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer'; // Import FooterComponent
import { filter } from 'rxjs';
import { slider } from './animation';
import { CookieBanner } from './components/cookie-banner/cookie-banner';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Navbar, Footer, CookieBanner],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [ slider ]
})
export class App {
  title = 'sk-portfolio';

  @ViewChild(RouterOutlet) outlet!: RouterOutlet;
  isAdminRoute = false;

  constructor(private router: Router) {
    // Listen for route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Check if the URL starts with '/admin' or is '/login', etc.
      this.isAdminRoute = event.urlAfterRedirects.startsWith('/admin') || 
                          event.urlAfterRedirects.startsWith('/login') ||
                          event.urlAfterRedirects.startsWith('/forgot-password') ||
                          event.urlAfterRedirects.startsWith('/reset-password');
    });
  }
  getRouteAnimationData() {
    if (!this.isAdminRoute) {
      return this.outlet && this.outlet.activatedRouteData && this.outlet.activatedRouteData['animation'];
    }
    return null; 
  }
}
