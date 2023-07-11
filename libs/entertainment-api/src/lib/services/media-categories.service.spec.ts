import { TestBed } from '@angular/core/testing';

import { MediaCategoriesService } from './media-categories.service';

describe('MediaCategoriesService', () => {
  let service: MediaCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
