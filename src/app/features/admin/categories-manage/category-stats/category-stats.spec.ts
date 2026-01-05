import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryStats } from './category-stats';

describe('CategoryStats', () => {
  let component: CategoryStats;
  let fixture: ComponentFixture<CategoryStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
