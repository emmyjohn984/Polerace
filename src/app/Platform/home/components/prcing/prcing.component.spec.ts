import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrcingComponent } from './prcing.component';

describe('PrcingComponent', () => {
  let component: PrcingComponent;
  let fixture: ComponentFixture<PrcingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrcingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrcingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
