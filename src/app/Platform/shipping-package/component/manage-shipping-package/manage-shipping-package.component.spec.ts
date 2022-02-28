import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageShippingPackageComponent } from './manage-shipping-package.component';

describe('ManageShippingPackageComponent', () => {
  let component: ManageShippingPackageComponent;
  let fixture: ComponentFixture<ManageShippingPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageShippingPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageShippingPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
