import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVisitsComponent } from './edit-visits.component';

describe('EditVisitsComponent', () => {
  let component: EditVisitsComponent;
  let fixture: ComponentFixture<EditVisitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVisitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
