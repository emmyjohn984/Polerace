import { TestBed } from '@angular/core/testing';

import { ShippingPackageService } from './shipping-package.service';

describe('ShippingPackageService', () => {
  let service: ShippingPackageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippingPackageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
