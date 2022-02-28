import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthfooterComponent } from './authfooter.component';

describe('AuthfooterComponent', () => {
  let component: AuthfooterComponent;
  let fixture: ComponentFixture<AuthfooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthfooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthfooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
