import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMarketplacesComponent } from './add-marketplaces.component';

describe('AddMarketplacesComponent', () => {
  let component: AddMarketplacesComponent;
  let fixture: ComponentFixture<AddMarketplacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMarketplacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMarketplacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
