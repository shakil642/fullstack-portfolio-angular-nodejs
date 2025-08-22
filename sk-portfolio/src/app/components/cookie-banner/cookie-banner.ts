import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core'; // 1. Add Inject and PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // 2. Import isPlatformBrowser
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../services/analytics';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-banner.html',
  styleUrl: './cookie-banner.scss'
})
export class CookieBanner implements OnInit {
  isVisible = false;
  private readonly cookieConsentKey = 'portfolio_cookie_consent';

  // 3. Inject PLATFORM_ID to know which environment we are in
  constructor(
    private analyticsService: AnalyticsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // 4. Only run browser-specific code if we are in the browser
    if (isPlatformBrowser(this.platformId)) {
      const consent = localStorage.getItem(this.cookieConsentKey);
      if (consent === 'true') {
        this.analyticsService.initializeAnalytics();
      } else if (!consent) {
        this.isVisible = true;
      }
    }
  }

  acceptCookies(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.cookieConsentKey, 'true');
      this.isVisible = false;
      this.analyticsService.initializeAnalytics();
    }
  }

  rejectCookies(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.cookieConsentKey, 'false');
      this.isVisible = false;
    }
  }
}