import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryListingComponent } from './subcategory-listing.component';

describe('SubcategoryListingComponent', () => {
  let component: SubcategoryListingComponent;
  let fixture: ComponentFixture<SubcategoryListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcategoryListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoryListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
