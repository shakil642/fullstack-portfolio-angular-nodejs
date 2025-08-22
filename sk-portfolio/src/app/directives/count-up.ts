import { Directive, Input, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements AfterViewInit, OnChanges {
  @Input('appCountUp') endValue: number = 0;
  @Input() duration: number = 1000; // Animation duration in milliseconds

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    this.animateValue();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['endValue']) {
      this.animateValue();
    }
  }

  private animateValue() {
    if (this.endValue === null || this.endValue === undefined) return;

    const startValue = 0;
    const startTime = performance.now();

    const frame = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / this.duration, 1);
      const currentValue = Math.floor(progress * (this.endValue - startValue) + startValue);

      this.el.nativeElement.innerText = currentValue.toLocaleString(); // Format with commas

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        this.el.nativeElement.innerText = this.endValue.toLocaleString();
      }
    };

    requestAnimationFrame(frame);
  }
}