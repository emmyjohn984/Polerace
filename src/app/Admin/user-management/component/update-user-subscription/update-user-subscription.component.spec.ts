import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserSubscriptionComponent } from './update-user-subscription.component';

describe('UpdateUserSubscriptionComponent', () => {
  let component: UpdateUserSubscriptionComponent;
  let fixture: ComponentFixture<UpdateUserSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateUserSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
