import { Directive, ElementRef, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadDirective implements OnInit {

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    // Only run this logic if we are in a browser
    if (isPlatformBrowser(this.platformId)) {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLImageElement;
            const src = element.getAttribute('data-src');
            if (src) {
              element.src = src; // Swap the data-src to the real src
            }
            observer.unobserve(element); // Stop observing once loaded
          }
        });
      }, options);

      observer.observe(this.el.nativeElement);
    }
  }
}
