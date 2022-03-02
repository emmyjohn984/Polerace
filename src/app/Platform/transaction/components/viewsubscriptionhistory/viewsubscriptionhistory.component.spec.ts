import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsubscriptionhistoryComponent } from './viewsubscriptionhistory.component';

describe('ViewsubscriptionhistoryComponent', () => {
  let component: ViewsubscriptionhistoryComponent;
  let fixture: ComponentFixture<ViewsubscriptionhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewsubscriptionhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsubscriptionhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
