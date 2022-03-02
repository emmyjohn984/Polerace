import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaskedDatetimeInputComponent } from './masked-datetime-input.component';

describe('MaskedDatetimeInputComponent', () => {
  let component: MaskedDatetimeInputComponent;
  let fixture: ComponentFixture<MaskedDatetimeInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaskedDatetimeInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaskedDatetimeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
