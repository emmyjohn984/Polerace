import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubscriptionPlanComponent } from './add-subscription-plan.component';

describe('AddSubscriptionPlanComponent', () => {
  let component: AddSubscriptionPlanComponent;
  let fixture: ComponentFixture<AddSubscriptionPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSubscriptionPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubscriptionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
