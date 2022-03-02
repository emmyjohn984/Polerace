import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionListingComponent } from './subscription-listing.component';

describe('SubscriptionListingComponent', () => {
  let component: SubscriptionListingComponent;
  let fixture: ComponentFixture<SubscriptionListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
