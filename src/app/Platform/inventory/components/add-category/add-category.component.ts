import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { UsersService } from '../../../settings/services/users.service'
import { CommonService } from '../../../settings/services/common.service'
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})

export class AddCategoryComponent implements OnInit {

  categoryAddForm: FormGroup;
  readonly: boolean = false;
  categoryID: number = 0;
  currentUser: any = {};
  category: any = {};
  sub: any = {};
  isResetCategory: boolean = false;
  filteredCategories: Observable<any>;
  categories: Array<any> = [];;
  loading: boolean = false;
  submitted = false;
  Edit:boolean = false;

  constructor(private router: Router, private inventoryService: InventoryService, private userService: UsersService,
    private commonService: CommonService, private formBuilder: FormBuilder, private notificationService: NotificationService
    , private route: ActivatedRoute) {
    // this.initializeFormControls();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') ? localStorage.getItem('currentUser') : sessionStorage.getItem('currentUser'));
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
    this.inventoryService.getCategoryById(categoryID).subscribe(async (response) => {
      this.loading=true;
      if (response.body.status === 200 && response.body.data != null) {
        this.loading=false;
        this.category = response.body.data;
        await this.categoryAddForm.patchValue(this.category);
        await this.hideloader();
      }
      else {
        this.notificationService.Error(response.body.message);
        this.loading=false;
      }

    }, error => {
      this.notificationService.Error("Something went wrong, please try again later.");
      this.loading=false;
    });
  }

  //To read query string values
  private readQuery() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
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
      amazonCategoryNodeId: [null],
      isActive: [true]
    });
  }

  get f() {
    return this.categoryAddForm.controls
  }

  onSubmit(event: any) {
    if (this.categoryAddForm.invalid) {
      this.submitted = true;
      Object.keys
        (this.categoryAddForm.controls).forEach((key) => {
          this.categoryAddForm.controls[key].markAsDirty();
        });
      return;
    }
    else {
      let postData = this.categoryAddForm.value;
      postData.companyId = this.currentUser.companyId;
      postData.categoryId = this.categoryID;
      this.inventoryService.createUpdateCategory(postData).subscribe(response => {
        if (response.body.status === 200 && response.body.data != null) {
          this.notificationService.Success(response.body.message);
          this.router.navigate(['./inventory/categories-listing']);
        }
        else {
          this.notificationService.Error(response.body.message);
        }
      }, error => {
        this.notificationService.Error("Something went wrong, please try again later.");
      });
    }
  }

  //To get categories
  getCategories() {
    this.inventoryService.getCategories(this.currentUser.companyId).subscribe(response => {
      if (response.body.status == 200) {
        this.categories = response.body.data;
        this.getFilteredCategories();
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error("Something went wrong, please try again later.");
    });
  }

  private getFilteredCategories() {
    this.filteredCategories = this.categoryAddForm.get('categoryName').valueChanges.pipe(startWith(''), map(item => item ? this._filterCategories(item) : this.categories.slice()));
  }

  _filterCategories(item: any): any {
    this.isResetCategory = true;
    const filterValue = item.toLowerCase();
    return this.categories.filter(option => option.categoryName.toLowerCase().indexOf(filterValue) === 0);
  }

  displayCategory(name) {
    if (name == undefined || name === '')
      this.isResetCategory = false;
    return name ? name : '';
  }

  hideloader() {
    this.loading = false;
  }

}


