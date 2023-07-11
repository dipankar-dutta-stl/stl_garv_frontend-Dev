import { TestBed } from '@angular/core/testing';

import { RestrictguestAuthGuardService } from './restrictguest-auth-guard.service';

describe('RestrictguestAuthGuardService', () => {
  let service: RestrictguestAuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestrictguestAuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
