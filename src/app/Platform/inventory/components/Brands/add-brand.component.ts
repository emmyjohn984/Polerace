import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/Platform/settings/services/users.service';
import { InventoryService } from '../../services/inventory.service';
import { PermissionsHelper } from 'src/app/shared/helpers/permissions-helper';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss']
})
export class AddBrandComponent implements OnInit {

  sub: any;
  brandForm: FormGroup;
  brandId: number = 0;
  brandInfo: any = {};
  submitted: boolean = false;

  constructor(private router: Router, private inventoryService: InventoryService,
    private userService: UsersService,
    public permissionHelper: PermissionsHelper,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder
    , private route: ActivatedRoute) {
    this.initializeFormControls();
  }

  ngOnInit(): void {
    this.readQuery();
    if (this.brandId > 0) {
      this.getbrandById(this.brandId);
    }

  }

  getbrandById(brandId) {

    this.inventoryService.getBrandById(brandId).subscribe(response => {
      if (response.body.data !== null) {
        this.brandInfo = response.body.data;
        this.brandForm.patchValue(this.brandInfo);
      }
      else {
        console.log("this.message", response.body.message);
      }

    }, error => {

    });


  }

  //To read query string values
  private readQuery() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.brandId = params['brandId'];
      });
  }

  get formControls() {
    return this.brandForm.controls;

  }

  //Initialize form controls
  private initializeFormControls() {
    this.brandForm = this.formBuilder.group({
      sellerId: [0],
      brandName: ['', Validators.required],
      isDefault: [false, Validators.required],
      isActive: [true, Validators.required]
    });


  }
  
  onSubmit(event: any) {
    if (!this.brandForm.invalid) {
      this.submitted = true;
      let userData = JSON.parse(localStorage.getItem('currentUser')?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser'));
      let postData = this.brandForm.value;
      if (this.brandId != undefined)
        postData.brandId = parseInt(this.brandId.toString());
      postData.companyId = userData.companyId;
      this.inventoryService.createUpdateBrand(postData).subscribe(response => {
        if (response.body.status === 200 && response.body.data != null) {
          this.notificationService.Success(response.body.message);
          this.router.navigate(['./inventory/brands']);
        }
        else {
          this.notificationService.Error(response.body.message);
        }
      }, error => {
        console.log('this.error', error);
        this.notificationService.Error(error.message);
      });

    }
  }

}
