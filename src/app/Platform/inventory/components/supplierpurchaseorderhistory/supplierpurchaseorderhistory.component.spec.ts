import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierpurchaseorderhistoryComponent } from './supplierpurchaseorderhistory.component';

describe('SupplierpurchaseorderhistoryComponent', () => {
  let component: SupplierpurchaseorderhistoryComponent;
  let fixture: ComponentFixture<SupplierpurchaseorderhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierpurchaseorderhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierpurchaseorderhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
