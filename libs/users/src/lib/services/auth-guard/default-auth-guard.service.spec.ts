import { TestBed } from '@angular/core/testing';

import { DefaultAuthGuardService } from './default-auth-guard.service';

describe('DefaultAuthGuardService', () => {
  let service: DefaultAuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultAuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
