import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImigrationComponent } from './imigration.component';

describe('ImigrationComponent', () => {
  let component: ImigrationComponent;
  let fixture: ComponentFixture<ImigrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImigrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImigrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
