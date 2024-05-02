import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathDeciderComponent } from './path-decider.component';

describe('PathDeciderComponent', () => {
  let component: PathDeciderComponent;
  let fixture: ComponentFixture<PathDeciderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PathDeciderComponent]
    });
    fixture = TestBed.createComponent(PathDeciderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
