import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductorderlistbysupplierComponent } from './productorderlistbysupplier.component';

describe('ProductorderlistbysupplierComponent', () => {
  let component: ProductorderlistbysupplierComponent;
  let fixture: ComponentFixture<ProductorderlistbysupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductorderlistbysupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductorderlistbysupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
