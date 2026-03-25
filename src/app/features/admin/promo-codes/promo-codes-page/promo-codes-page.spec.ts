import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoCodesPageTs } from './promo-codes-page.js';

describe('PromoCodesPageTs', () => {
  let component: PromoCodesPageTs;
  let fixture: ComponentFixture<PromoCodesPageTs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoCodesPageTs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromoCodesPageTs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
