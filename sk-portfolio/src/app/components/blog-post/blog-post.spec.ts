import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogPost } from './blog-post';

describe('BlogPost', () => {
  let component: BlogPost;
  let fixture: ComponentFixture<BlogPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogPost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogPost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
