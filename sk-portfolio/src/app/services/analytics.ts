import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private measurementId = 'G-QDQSBLS07E';
  private hasConsent = false;

  constructor(private router: Router) { }

  // This method is called by the cookie banner when consent is given.
  public initializeAnalytics(): void {
    this.hasConsent = true;

    // Send the first pageview immediately upon consent
    this.trackPageView(this.router.url);

    // Then, listen for all future route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.trackPageView(event.urlAfterRedirects);
    });
  }

  // This method sends the page view event to Google Analytics.
  private trackPageView(path: string): void {
    // Only track if consent has been given
    if (!this.hasConsent) {
      return;
    }

    gtag('config', this.measurementId, {
      'page_path': path
    });
  }
}