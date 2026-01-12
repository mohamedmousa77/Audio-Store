import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAddress } from './personal-address';

describe('PersonalAddress', () => {
  let component: PersonalAddress;
  let fixture: ComponentFixture<PersonalAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAddress);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
