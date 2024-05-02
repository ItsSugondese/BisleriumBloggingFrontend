import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogInspectComponent } from './blog-inspect.component';

describe('BlogInspectComponent', () => {
  let component: BlogInspectComponent;
  let fixture: ComponentFixture<BlogInspectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlogInspectComponent]
    });
    fixture = TestBed.createComponent(BlogInspectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
