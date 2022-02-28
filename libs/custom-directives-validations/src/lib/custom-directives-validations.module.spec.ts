import { async, TestBed } from '@angular/core/testing';
import { CustomDirectivesValidationsModule } from './custom-directives-validations.module';

describe('CustomDirectivesValidationsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CustomDirectivesValidationsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(CustomDirectivesValidationsModule).toBeDefined();
  });
});
