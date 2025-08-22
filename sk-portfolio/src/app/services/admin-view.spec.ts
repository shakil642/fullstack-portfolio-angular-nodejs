import { TestBed } from '@angular/core/testing';

import { AdminView } from './admin-view';

describe('AdminView', () => {
  let service: AdminView;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminView);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
