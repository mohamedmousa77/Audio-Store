import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalOrders } from './personal-orders';

describe('PersonalOrders', () => {
  let component: PersonalOrders;
  let fixture: ComponentFixture<PersonalOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
