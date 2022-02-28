import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchVisitsComponent } from './search-visits.component';

describe('SearchVisitsComponent', () => {
  let component: SearchVisitsComponent;
  let fixture: ComponentFixture<SearchVisitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchVisitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
