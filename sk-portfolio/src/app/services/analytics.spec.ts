import { TestBed } from '@angular/core/testing';

import { Analytics } from './analytics';

describe('Analytics', () => {
  let service: Analytics;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Analytics);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
