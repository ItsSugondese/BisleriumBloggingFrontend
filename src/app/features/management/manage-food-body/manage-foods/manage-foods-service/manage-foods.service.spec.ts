import { TestBed } from '@angular/core/testing';

import { ManageBlogService } from './manage-foods.service';

describe('ManageFoodsService', () => {
  let service: ManageBlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageBlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
