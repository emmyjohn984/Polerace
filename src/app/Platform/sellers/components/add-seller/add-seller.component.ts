import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SellersService } from '../../services/sellers.service';
import { UsersService } from '../../../settings/services/users.service';
import { CommonService } from '../../../settings/services/common.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';

@Component({
  selector: 'app-add-seller',
  templateUrl: './add-seller.component.html',
  styleUrls: ['./add-seller.component.scss'],
})
export class AddSellerComponent implements OnInit {
  // sellerAddForm: FormGroup;
  sellerEditForm: FormGroup;
  roles: Array<any> = [];
  submitted: boolean = false;
  readonly: boolean = false;
  sellerId: number = 0;
  sub: any;
  userData: any;
  seller: any = {};
  sellerCompanyInfo: any = {};
  sellerCompanyId: string;
  countries: any = [];
  states: any = [];
  Edit: boolean = false;
  loading: boolean = false;
  currencies: any = [];

  constructor(
    private router: Router,
    private sellerService: SellersService,
    private userService: UsersService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
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

  get f() {
    return this.sellerEditForm.controls;
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

  getstates(countryId) {
    this.commonService.getstates(countryId).subscribe(
      (response) => {
        if (response.body != null) this.states = response.body.data;
        else console.log(response.body.error);
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  ngOnInit() {
    this.userData = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    this.readQuery();
    if (this.sellerId > 0) {
      this.loading = true;
      this.getSellerCompanyInfo(this.sellerId);
      this.Edit = true;
    }
  }

  getSellerCompanyInfo(sellerId) {
    this.sellerService.getSellersByCompanyId(sellerId).subscribe(
      (response) => {
        if (response.body.data !== null) {
          this.sellerCompanyInfo = response.body.data;
          this.getstates(this.sellerCompanyInfo.countryId);
          this.sellerEditForm.patchValue(this.sellerCompanyInfo);
          this.loading = false;
        } else {
          this.loading = false;
          console.log('this.message', response.body.message);
        }
      },
      (error) => {
        this.loading = false;
        this.notificationService.Error(
          'Something went wrong. Please try again later.'
        );
      }
    );
  }

  //To read query string values
  private readQuery() {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.sellerId = params['sellerId'];
      this.sellerCompanyId = params['companyId'];
    });
  }

  get formControls() {
    // if(this.sellerId>0)
    // return this.sellerAddForm.controls;
    // else
    return this.sellerEditForm.controls;
  }

  //Initialize form controls
  private initializeFormControls() {
    this.sellerEditForm = this.formBuilder.group({
      sellerId: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      //companyEmail:['',Validators.required],
      description: [''],
      companyId: [''],
      companyName: [''],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
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
      currencyId: ['', Validators.required],
      isActive: [true, Validators.required],
    });
  }

  validateNumberInput(e) {
    if (e.target.attributes.id.value === 'phone')
      this.sellerEditForm.get('phone').setValue(e.target.value.match(/[0-9]*/));
    else if (e.target.attributes.id.value === 'fax')
      this.sellerEditForm.get('fax').setValue(e.target.value.match(/[0-9]*/));
    else if (e.target.attributes.id.value === 'postalCode')
      this.sellerEditForm
        .get('postalCode')
        .setValue(e.target.value.match(/[0-9]*/));
  }

  onSubmit(event: any) {
    this.submitted = true;
    if (!this.sellerEditForm.invalid) {
      let userData = JSON.parse(
        localStorage.getItem('currentUser')
          ? localStorage.getItem('currentUser')
          : sessionStorage.getItem('currentUser')
      );
      let postData = this.sellerEditForm.value;
      if (this.sellerId > 0) {
        postData.companyId = this.userData.companyId;
        postData.userId = this.sellerCompanyInfo.userId;
        postData.isUserModified = true;
        postData.postalCode = this.sellerEditForm.value.postalCode.toString();
        postData.phone = this.sellerEditForm.value.phone.toString();
        // postData.fax = this.sellerEditForm.value.fax.toString();
        this.sellerService.updateSeller(postData).subscribe(
          (response) => {
            if (response.body.status === 200) {
              this.notificationService.Success(response.body.message);
              this.router.navigate(['./sellers/managesellers']);
            } else {
              this.notificationService.Error(response.body.message);
            }
          },
          (error) => {
            this.notificationService.Error(error);
          }
        );
      } else {
        postData.postalCode = this.sellerEditForm.value.postalCode.toString();
        postData.phone = this.sellerEditForm.value.phone.toString();
        postData.companyId = this.userData.companyId;
        // postData.fax = this.sellerEditForm.value.fax.toString();
        this.sellerService.createSeller(postData).subscribe(
          (response) => {
            if (response.body.status === 200) {
              this.notificationService.Success(response.body.message);
              this.router.navigate(['./sellers/managesellers']);
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
}
