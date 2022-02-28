import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersFromDiffMarketplacesComponent } from './orders-from-diff-marketplaces.component';

describe('OrdersFromDiffMarketplacesComponent', () => {
  let component: OrdersFromDiffMarketplacesComponent;
  let fixture: ComponentFixture<OrdersFromDiffMarketplacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersFromDiffMarketplacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersFromDiffMarketplacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
