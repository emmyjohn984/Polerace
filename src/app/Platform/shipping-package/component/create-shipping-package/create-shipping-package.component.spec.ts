import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShippingPackageComponent } from './create-shipping-package.component';

describe('CreateShippingPackageComponent', () => {
  let component: CreateShippingPackageComponent;
  let fixture: ComponentFixture<CreateShippingPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateShippingPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateShippingPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
