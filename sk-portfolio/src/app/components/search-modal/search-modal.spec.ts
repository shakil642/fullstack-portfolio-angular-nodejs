import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchModal } from './search-modal';

describe('SearchModal', () => {
  let component: SearchModal;
  let fixture: ComponentFixture<SearchModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
