import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImigrationandpartnersComponent } from './imigrationandpartners.component';

describe('ImigrationandpartnersComponent', () => {
  let component: ImigrationandpartnersComponent;
  let fixture: ComponentFixture<ImigrationandpartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImigrationandpartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImigrationandpartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
