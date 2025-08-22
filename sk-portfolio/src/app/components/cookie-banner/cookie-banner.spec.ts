import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieBanner } from './cookie-banner';

describe('CookieBanner', () => {
  let component: CookieBanner;
  let fixture: ComponentFixture<CookieBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookieBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookieBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
