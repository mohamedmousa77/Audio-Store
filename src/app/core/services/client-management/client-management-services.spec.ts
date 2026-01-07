import { TestBed } from '@angular/core/testing';

import { ClientManagementServices } from './client-management-services';

describe('ClientManagementServices', () => {
  let service: ClientManagementServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientManagementServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
