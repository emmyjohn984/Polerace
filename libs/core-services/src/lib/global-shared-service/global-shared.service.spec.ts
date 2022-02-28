import { TestBed } from '@angular/core/testing';

import { GlobalSharedService } from './global-shared.service';

describe('GlobalSharedService', () => {
  let service: GlobalSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
