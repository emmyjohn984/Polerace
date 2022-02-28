import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { UsersService } from '../../../settings/services/users.service'
import { CommonService } from '../../../settings/services/common.service'
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-suppliers.component.html',
  styleUrls: ['./add-suppliers.component.scss']
})

export class AddSupplierComponent implements OnInit {
  supplierEditForm: FormGroup;
  roles: Array<any> = [];
  submitted: boolean = false;
  readonly: boolean = false;
  supplierId: number = 0;
  sub: any;
  supplier: any = {};
  supplierCompanyInfo: any = {};
  supplierCompanyId: string;
  countries: any = [];
  states: any = [];
  currencies: any = [];
  loading: boolean = false;
  Edit: boolean = false;

  constructor(private router: Router, private inventoryService: InventoryService, private userService: UsersService,
    private commonService: CommonService, private formBuilder: FormBuilder, private notificationService: NotificationService, private route: ActivatedRoute) {
    this.getCountries();
    this.getCurrencies();
    this.initializeFormControls();
  }

  //Initialize form controls
  private initializeFormControls() {
    this.supplierEditForm = this.formBuilder.group({
      supplierId: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      //companyEmail:['',Validators.required],
      //companyName: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      countryId: ['', Validators.required],
      city: ['', Validators.required],
      stateId: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern("^[0-9]{5}(?:-[0-9]{4})?$")]],
      phone: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      isActive: [true, Validators.required]
      //   fax: [''],
      //   websiteUrl: [''],
      //   currencyId: ['', Validators.required],
      // isActive: [true, Validators.required],
    });
  }

  get f() {
    return this.supplierEditForm.controls
  }

  getCurrencies() {
    this.commonService.getCurrencies().subscribe(response => {
      if (response.body != null)
        this.currencies = response.body.data;
    }, error => { this.notificationService.Error(error.message); });

  }

  getCountries() {
    this.commonService.getCountries().subscribe(response => {
      if (response.body != null)
        this.countries = response.body.data;
    }, error => { this.notificationService.Error(error.message); });

  }

  //Country change
  onCountryChange(event) {
    let countryId = event.target.value;
    if (countryId) {
      this.getstates(countryId);
    }
  }

  getstates(e: any) {
    let countryId: number;
    if (e.value === undefined) countryId = e;
    else countryId = e.value;
    this.commonService.getstates(countryId).subscribe(response => {
      if (response.body != null)
        this.states = response.body.data;
      else
        console.log(response.body.error);
    }, error => {
      this.notificationService.Error(error.message);
    });
  }

  ngOnInit(): void {
    this.readQuery();
    if (this.supplierId > 0) {
      this.loading = true;
      this.Edit = true;
      this.getsupplierCompanyInfo(this.supplierId);
    }
  }

  getsupplierCompanyInfo(supplierId) {
    this.inventoryService.getSupplierById(supplierId).subscribe(async (response) => {
      if (response.body.data !== null) {
        this.supplierCompanyInfo = response.body.data;
        if (this.supplierCompanyInfo.countryId)
          await this.getstates(this.supplierCompanyInfo.countryId);
        // this.supplierCompanyInfo.password = this.supplierCompanyInfo.password.substr(0, 6);
        await this.supplierEditForm.patchValue(this.supplierCompanyInfo);
        this.loading = false;
      }
      else {
        console.log("this.message", response.body.message);
      }

    }, error => {
      this.notificationService.Error(error.message);
      console.log('this.error', error);
    });
  }

  //To read query string values
  private readQuery() {
    this.sub = this.route.queryParams
      .subscribe(params => {
        this.supplierId = params['supplierId'];
        // this.supplierCompanyId = params['companyId'];
      });
  }

  get formControls() {
    // if(this.supplierId>0)
    // return this.supplierAddForm.controls;
    // else
    return this.supplierEditForm.controls;

  }




  validateNumberInput(e) {
    if (e.target.attributes.id.value === 'phone')
      this.supplierEditForm.get('phone').setValue(e.target.value.match(/[0-9]*/))
    else if (e.target.attributes.id.value === 'fax')
      this.supplierEditForm.get('fax').setValue(e.target.value.match(/[0-9]*/))
    else if (e.target.attributes.id.value === 'postalCode')
      this.supplierEditForm.get('postalCode').setValue(e.target.value.match(/[0-9]*/))
  }

  onSubmit(event: any) {
    this.submitted = true;
    if (!this.supplierEditForm.invalid) {
      let userData = JSON.parse(localStorage.getItem('currentUser') ? localStorage.getItem('currentUser') : sessionStorage.getItem('currentUser'));
      let postData = this.supplierEditForm.value;
      postData.landMark = "";
      if (this.supplierId > 0) {
        postData.supplierId = parseInt(this.supplierId.toString());
      }
      postData.companyId = userData.companyId;
      // postData.userId = this.supplierCompanyInfo.userId;
      postData.isUserModified = true;
      postData.postalCode = this.supplierEditForm.value.postalCode.toString();
      postData.phone = this.supplierEditForm.value.phone.toString();
      // postData.fax = this.supplierEditForm.value.fax.toString();
      this.inventoryService.createUpdateSupplier(postData).subscribe(response => {
        if (response.body.status === 200) {
          this.notificationService.Success(response.body.message);
          this.router.navigate(['./inventory/suppliers']);
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
