import { TestBed } from '@angular/core/testing';

import { NgxUtilityServicesService } from './ngx-utility-services.service';

describe('NgxUtilityServicesService', () => {
  let service: NgxUtilityServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxUtilityServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
