import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryProductsPage } from './category-products-page';

describe('CategoryProductsPage', () => {
  let component: CategoryProductsPage;
  let fixture: ComponentFixture<CategoryProductsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryProductsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryProductsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
