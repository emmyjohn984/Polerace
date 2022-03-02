import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductandfeaturesComponent } from './productandfeatures.component';

describe('ProductandfeaturesComponent', () => {
  let component: ProductandfeaturesComponent;
  let fixture: ComponentFixture<ProductandfeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductandfeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductandfeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
