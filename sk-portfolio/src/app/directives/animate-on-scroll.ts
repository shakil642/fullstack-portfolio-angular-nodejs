import { Directive, ElementRef, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appAnimateOnScroll]',
  standalone: true
})
export class AnimateOnScrollDirective implements OnInit {

  constructor(
    private el: ElementRef, 
    private renderer: Renderer2, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

 ngOnInit() {
    // 3. Only run this code if we are in a browser
    if (isPlatformBrowser(this.platformId)) {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.renderer.addClass(this.el.nativeElement, 'is-visible');
            observer.unobserve(this.el.nativeElement);
          }
        });
      }, options);

      observer.observe(this.el.nativeElement);
    }
  }
}