import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UsersService } from 'src/app/Platform/settings/services/users.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-add-subcategory',
  templateUrl: './add-subcategory.component.html',
  styleUrls: ['./add-subcategory.component.scss'],
})
export class AddSubcategoryComponent implements OnInit {
  categoryAddForm: FormGroup;
  submitted: boolean = false;
  readonly: boolean = false;
  categoryID: number = 0;
  currentUser: any = {};
  category: any = {};
  sub: any = {};
  Edit: boolean = false;
  isResetCategory: boolean = false;
  filteredCategories: Observable<any>;
  categories: Array<any> = [];
  loading: boolean = false;
  sortcategories: any;
  filtersubc: any = [];
  constructor(
    private router: Router,
    private inventoryService: InventoryService,
    private userService: UsersService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {
    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    this.getCategories();
  }

  ngOnInit(): void {
    this.initializeFormControls();
    this.readQuery();
    if (this.categoryID > 0) {
      this.Edit = true;
      this.loading = true;
      this.getCategoryById(this.categoryID);
    }
  }

  getCategoryById(categoryID) {
    this.inventoryService.getCategoryById(categoryID).subscribe(
      (response) => {
        this.loading=true;
        if (response.body.status === 200 && response.body.data != null) {
          this.loading=false;
          this.category = response.body.data;
          this.categoryAddForm.patchValue(this.category);
        } else {
          this.notificationService.Error(response.body.message);
          this.loading=false;
        }
      },
      (error) => {
        this.notificationService.Error(error.message);
        this.loading=false;
      }
    );
  }

  //To read query string values
  private readQuery() {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.categoryID = params['categoryID'];
    });
  }

  get formControls() {
    return this.categoryAddForm.controls;
  }

  resetAuto(name) {
    if (name === 'category') {
      this.isResetCategory = false;
      this.categoryAddForm.get('categoryName').setValue('');
    }
  }

  //Initialize form controls
  public initializeFormControls() {
    this.categoryAddForm = this.formBuilder.group({
      supplierId: [0],
      categoryName: ['', Validators.required],
      amazonItemTypeKeyword: [''],
      eBayCategoryID: [''],
      walmartCategoryName: [''],
      categoryDescription: [''],
      parentCategoryId: ['', Validators.required],
      amazonCategoryNodeId: [null],
      isActive: [true],
    });
  }

  get f() {
    return this.categoryAddForm.controls;
  }

  onSubmit(event: any) {
    this.submitted=true;
    if(!this.categoryAddForm.invalid){
      let postData = this.categoryAddForm.value;
      postData.companyId = this.currentUser.companyId;
      postData.categoryId = this.categoryID;
      this.inventoryService.createUpdateCategory(postData).subscribe(
        (response) => {
          if (response.body.status === 200 && response.body.data != null) {
            this.notificationService.Success(response.body.message);
            this.router.navigate(['./inventory/subcategories-listing']);
          } else {
            this.notificationService.Error(response.body.message);
          }
        },
        (error) => {
          this.notificationService.Error(error.message);
        }
      );
    }
  }

  //To get categories
  getCategories() {
    this.inventoryService.getCategories(this.currentUser.companyId).subscribe(
      (response) => {
        this.loading=true;
        if (response.body.status == 200) {
          this.categories = response.body.data;
          this.filtersubc = this.categories.filter(
            (option) =>
              option.parentCategoryId === 0 || option.parentCategoryId === null
          );
          this.loading=false;
          this.sortcategories = this.categories;
          this.getFilteredCategories();
        } else {
          this.notificationService.Error(response.body.message);
          this.loading=false;
        }
      },
      (error) => {
        this.notificationService.Error(error.message);
        this.loading=false;
      }
    );
  }

  private getFilteredCategories() {
    this.filteredCategories = this.categoryAddForm
      .get('categoryName')
      .valueChanges.pipe(
        startWith(''),
        map((item) =>
          item ? this._filterCategories(item) : this.categories.slice()
        )
      );
  }

  _filterCategories(item: any): any {
    this.isResetCategory = true;
    const filterValue = item.toLowerCase();
    return this.categories.filter(
      (option) => option.categoryName.toLowerCase().indexOf(filterValue) === 0
    );
  }

  displayCategory(name) {
    if (name == undefined || name === '') this.isResetCategory = false;
    return name ? name : '';
  }

  hideloader() {
    document.getElementById('loader').style.display = 'none';
    this.loading = false;
  }
}
