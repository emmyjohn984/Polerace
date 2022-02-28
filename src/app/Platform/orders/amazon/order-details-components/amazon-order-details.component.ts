import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../settings/services/users.service';
import { CommonService } from '../../../settings/services/common.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { CustomerService } from '../../../customers/services/customer.service';
import { AmazonOrdersService } from '../../services/amazon.orders.services';

@Component({
  selector: 'app-amazon-order',
  templateUrl: './amazon-order-details.component.html',
  styleUrls: ['./amazon-order-details.component.scss'],
})
export class AmazonOrderDetails implements OnInit {
  // sellerAddForm: FormGroup;
  sellerEditForm: FormGroup;
  roles: Array<any> = [];
  submitted: boolean = false;
  readonly: boolean = true;
  sellerId: number = 0;
  sub: any;
  seller: any = {};
  sellerCompanyInfo: any = {};
  sellerCompanyId: string;
  countries: any = [];
  states: any = [];
  currencies: any = [];
  marketPlace: any = '';
  constructor(
    private router: Router,
    private userService: UsersService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private customerService: CustomerService,
    private amazonOrderService: AmazonOrdersService,
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

  getstates(e: any) {
    let countryId: number;
    if (e.value === undefined) countryId = e;
    else countryId = e.value;
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

  ngOnInit(): void {
    this.readQuery();
    if (this.sellerId > 0) {
      this.getSellerCompanyInfo(this.sellerId);
    }
  }

  getSellerCompanyInfo(sellerId) {
    this.amazonOrderService.getAmazonOrderDetails(sellerId).subscribe(
      (respose) => {
        if (respose.status == 200) {
          this.sellerCompanyInfo = respose?.body?.data;
          this.sellerEditForm.patchValue(this.sellerCompanyInfo);
        }
      },
      (error) => {}
    );
  }

  cancel() {
    this.router.navigate(['/orders/amazonorders']);
  }

  //To read query string values
  private readQuery() {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.sellerId = params['amazonOrderId'];
      this.marketPlace = params['marketplace'];
    });
  }

  get formControls() {
    // if(this.sellerId>0)
    // return this.sellerAddForm.controls;
    // else
    return this.sellerEditForm.controls;
  }

  get subFormControl() {
    let subForm = this.sellerEditForm.controls[
      'amazonOrdersShippingAddress'
    ] as FormGroup;
    return subForm.controls;
  }

  //Initialize form controls
  private initializeFormControls() {
    this.sellerEditForm = this.formBuilder.group({
      amazonOrderRowId: [0],
      amazonOrderId: [{ value: '', disabled: true }],
      buyerName: [{ value: '', disabled: true }, Validators.required],
      orderStatus: [{ value: '', disabled: true }, Validators.required],
      buyerEmail: [
        { value: '', disabled: true },
        [Validators.required, Validators.required, Validators.email],
      ],
      orderType: [{ value: '', disabled: true }],
      isPremiumOrder: [{ value: '', disabled: true }, Validators.required],
      isBusinessOrder: [{ value: '', disabled: true }],
      isReplacementOrder: [{ value: '', disabled: true }],
      isPrime: [{ value: '', disabled: true }],
      numberOfItemsShipped: [{ value: '', disabled: true }],
      numberOfItemsUnshipped: [{ value: '', disabled: true }],
      orderTotal_Amount: [{ value: '', disabled: true }],
      orderTotal_CurrencyCode: [{ value: '', disabled: true }],
      purchaseDate: [{ value: '', disabled: true }],
      tfmShipmentStatus: [{ value: '', disabled: true }],
      payment_Amount: [{ value: '', disabled: true }],
      payment_CurrencyCode: [{ value: '', disabled: true }],
      payment_PaymentMethod: [{ value: '', disabled: true }],
      //companyEmail:['',Validators.required],
      lastUpdateDate: [{ value: '', disabled: true }, Validators.required],
      latestShipDate: [{ value: '', disabled: true }, Validators.required],
      fulfillmentChannel: [{ value: '', disabled: true }],
      earliestShipDate: [{ value: '', disabled: true }],
      earliestDeliveryDate: [{ value: '', disabled: true }],
      latestDeliveryDate: [{ value: '', disabled: true }],
      cbaDisplayableShippingLabel: [{ value: '', disabled: true }],
      amazonOrdersShippingAddress: this.formBuilder.group({
        addressLine1: [{ value: '', disabled: true }, Validators.required],
        addressLine2: [{ value: '', disabled: true }],
        addressLine3: [{ value: '', disabled: true }],
        addressType: [{ value: '', disabled: true }],
        municipality: [{ value: '', disabled: true }],
        country: [{ value: '', disabled: true }, Validators.required],
        city: [{ value: '', disabled: true }, Validators.required],
        state: [{ value: '', disabled: true }, Validators.required],
        postalCode: [
          { value: '', disabled: true },
          [Validators.required, Validators.maxLength(6)],
        ],
        phone: [
          { value: '', disabled: true },
          [Validators.required, Validators.maxLength(11)],
        ],
      }),
      shipServiceLevel: [{ value: '', disabled: true }],
      shipmentServiceLevelCategory: [{ value: '', disabled: true }],

      // isActive: [true, Validators.required],
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
    if (!this.sellerEditForm.invalid) {
      this.submitted = true;
      let userData = JSON.parse(
        localStorage.getItem('currentUser')
          ? localStorage.getItem('currentUser')
          : sessionStorage.getItem('currentUser')
      );
      let postData = this.sellerEditForm.value;
      postData.customerId = this.sellerId;
      postData.companyId = userData.companyId;
      postData.postalCode = this.sellerEditForm.value.postalCode.toString();
      postData.phone = this.sellerEditForm.value.phone.toString();
      postData.fax = this.sellerEditForm.value.fax.toString();
      postData.userMarketplace = this.marketPlace;
      this.customerService.addUpdateCustomer(postData).subscribe(
        (response) => {
          if (response.body.status === 200) {
            this.notificationService.Success(response.body.message);
            this.cancel();
          } else {
            this.notificationService.Error(response.body.message);
          }
        },
        (error) => {
          console.log('this.error', error);
          this.notificationService.Error(error);
        }
      );
    }
  }
}
