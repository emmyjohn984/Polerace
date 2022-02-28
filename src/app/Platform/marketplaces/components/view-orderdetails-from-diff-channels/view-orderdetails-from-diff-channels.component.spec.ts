import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrderdetailsFromDiffChannelsComponent } from './view-orderdetails-from-diff-channels.component';

describe('ViewOrderdetailsFromDiffChannelsComponent', () => {
  let component: ViewOrderdetailsFromDiffChannelsComponent;
  let fixture: ComponentFixture<ViewOrderdetailsFromDiffChannelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOrderdetailsFromDiffChannelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOrderdetailsFromDiffChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
