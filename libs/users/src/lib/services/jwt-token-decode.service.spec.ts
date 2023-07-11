import { TestBed } from '@angular/core/testing';

import { JwtTokenDecodeService } from './jwt-token-decode.service';

describe('JwtTokenDecodeService', () => {
  let service: JwtTokenDecodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtTokenDecodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
