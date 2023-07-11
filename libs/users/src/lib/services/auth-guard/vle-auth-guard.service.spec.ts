import { TestBed } from '@angular/core/testing';

import { VleAuthGuardService } from './vle-auth-guard.service';

describe('VleAuthGuardService', () => {
  let service: VleAuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VleAuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
