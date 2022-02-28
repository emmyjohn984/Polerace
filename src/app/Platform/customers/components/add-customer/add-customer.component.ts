import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { SellersService } from 'src/app/Platform/sellers/services/sellers.service';
import { UsersService } from 'src/app/Platform/settings/services/users.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { CommonService } from 'src/app/Platform/settings/services/common.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
  customerForm: FormGroup;
  roles: Array<any> = [];
  submitted: boolean = false;
  readonly: boolean = false;
  sellerId: number = 0;
  sub: any;
  CutomerInfo: any;
  seller: any = {};
  sellerCompanyInfo: any = {};
  sellerCompanyId: string;
  countries: any = [];
  states: any = [];
  currencies: any = [];
  marketPlace: any = '';
  Edit: boolean = false;
  loading: boolean = false;
  customerId: number;
  countryName = '';

  constructor(
    private router: Router,
    private sellerService: SellersService,
    private userService: UsersService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private customerService: CustomerService,
    private route: ActivatedRoute
  ) {
    this.getCountries();
    this.getCurrencies();
    this.initializeFormControls();
  }

  getCurrencies() {
    this.commonService.getCurrencies().subscribe(
      (response) => {
        if (response.body != null) this.currencies = response.body.data;
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  getCountries() {
    this.commonService.getCountries().subscribe(
      (response) => {
        if (response.body != null) this.countries = response.body.data;
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  //Country change
  onCountryChange(event) {
    let countryId = event.target.value;
    if (countryId) {
      this.getStates(countryId);
    }
  }

  getStates(countryId) {
    this.commonService.getstates(countryId).subscribe(
      (response) => {
        if (response.body != null) this.states = response.body.data;
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  ngOnInit(): void {
    this.readQuery();
    if (this.customerId > 0) {
      this.getCustomerById(this.customerId);
    }
  }

  getCustomerById(customerId) {
    this.loading = true;
    this.Edit = true;
    this.customerService.getCustomer(customerId).subscribe(
      async (response) => {
        if (response.body.data != null) {
          this.CutomerInfo = response.body.data;
          this.countryName = this.CutomerInfo.countryId;
          await this.getStates(this.CutomerInfo.countryId);
          await this.customerForm.patchValue(this.CutomerInfo);
          this.loading = false;
        } else {
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  cancel() {
    if (this.marketPlace == 'ebay')
      this.router.navigate(['/customers/customerListing'], {
        queryParams: { marketPlace: this.marketPlace },
      });
    if (this.marketPlace == 'amazon')
      this.router.navigate(['/customers/amazoncustomerListing'], {
        queryParams: { marketPlace: this.marketPlace },
      });
    if (this.marketPlace == 'walmart')
      this.router.navigate(['/customers/customerListing'], {
        queryParams: { marketPlace: this.marketPlace },
      });
  }

  //To read query string values
  private readQuery() {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.customerId = params['customerId'];
    });
  }

  get formControls() {
    return this.customerForm.controls;
  }

  //Initialize form controls
  private initializeFormControls() {
    this.customerForm = this.formBuilder.group({
      customerId: [0],
      companyId: [''],
      namePrefix: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      description: [''],
      taxNumber: ['', Validators.required],
      userMarketPlace: [''],
      companyName: [''],
      label: [''],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      suburb: [''],
      countryId: ['', Validators.required],
      city: ['', Validators.required],
      stateId: ['', Validators.required],
      postalCode: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')],
      ],
      phone: ['', [Validators.required, Validators.pattern('[0-9 ]{10}')]],
      fax: [''],
      websiteUrl: [''],
      isActive: [true],
    });
  }

  get f() {
    return this.customerForm.controls;
  }

  validateNumberInput(e) {
    if (e.target.attributes.id.value === 'phone')
      this.customerForm.get('phone').setValue(e.target.value.match(/[0-9]*/));
    else if (e.target.attributes.id.value === 'fax')
      this.customerForm.get('fax').setValue(e.target.value.match(/[0-9]*/));
    else if (e.target.attributes.id.value === 'postalCode')
      this.customerForm
        .get('postalCode')
        .setValue(e.target.value.match(/[0-9]*/));
  }

  onSubmit(event: any) {
    this.submitted = true;
    if (!this.customerForm.invalid) {
      let userData = JSON.parse(
        localStorage.getItem('currentUser')
          ? localStorage.getItem('currentUser')
          : sessionStorage.getItem('currentUser')
      );
      let postData = this.customerForm.value;
      postData.companyId = userData.companyId;
      postData.companyName = userData.companyName;
      this.customerService.addUpdateCustomer(postData).subscribe(
        (response) => {
          if (response.body.status === 200) {
            if (response.body.message == 'Email already exist.') {
              this.notificationService.Error('Email already exist.');
            } else {
              this.notificationService.Success(response.body.message);
              this.router.navigateByUrl('customers/mangecustomers');
            }
          } else {
            this.notificationService.Error(response.body.message);
          }
        },
        (error) => {
          console.log('this.error', error);
          this.notificationService.Error(
            'Something went wrong. Please try again later.'
          );
        }
      );
    }
  }
}
