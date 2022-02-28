import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlacesProfitListComponent } from './market-places-profit-list.component';

describe('MarketPlacesProfitListComponent', () => {
  let component: MarketPlacesProfitListComponent;
  let fixture: ComponentFixture<MarketPlacesProfitListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketPlacesProfitListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketPlacesProfitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
