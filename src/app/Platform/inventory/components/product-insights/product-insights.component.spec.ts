import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInsightsComponent } from './product-insights.component';

describe('ProductInsightsComponent', () => {
  let component: ProductInsightsComponent;
  let fixture: ComponentFixture<ProductInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
