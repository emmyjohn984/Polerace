import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVisitsComponent } from './add-visits.component';

describe('AddVisitsComponent', () => {
  let component: AddVisitsComponent;
  let fixture: ComponentFixture<AddVisitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVisitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
