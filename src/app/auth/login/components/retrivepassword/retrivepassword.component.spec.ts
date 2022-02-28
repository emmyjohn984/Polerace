import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrivepasswordComponent } from './retrivepassword.component';

describe('RetrivepasswordComponent', () => {
  let component: RetrivepasswordComponent;
  let fixture: ComponentFixture<RetrivepasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrivepasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrivepasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
