import { Component, OnInit, Inject } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { ActivatedRoute } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { CustomAttribute } from '../../models/CustomAttribute';
import { BehaviorSubject } from 'rxjs';
import { ShippinServicesModel } from '../../models/ShippingServices';
import { UsersService } from '../../../settings/services/users.service';
import { Channels } from 'src/app/shared/enums/channels';
import { PermissionsHelper } from 'src/app/shared/helpers/permissions-helper';

@Component({
  selector: 'app-ebay-presets-dialgue.component',
  templateUrl: './ebay-presets-dialgue.component.html',
  styleUrls: ['./ebay-presets-dialgue.component.scss'],
})
export class EbayPresetsDialogueComponent implements OnInit {
  setupeBayFormGroup: FormGroup;
  selectedIndex: number = 0;
  userData: any = {};
  paymentPresets: Array<any> = [];
  eBayListingProfile: any;
  eBayListingCondition: Array<any> = [];
  eBayListingDurationFiltered: Array<any> = [];
  customAttrIndexesForEdit: Array<any> = [];
  ebayGlobalMasterData: any;
  ebayShippingTypes: Array<any> = [];
  ebayShippingDurations: Array<any> = [];
  ebayReturnPolicies: Array<any> = [];
  ebayReturnsWhitinOptions: Array<any> = [];
  ebayRefundOptions: Array<any> = [];
  ebayReturnCostPaidBy: Array<any> = [];
  inventoryId: any;
  userMarketplace: any = {};
  submitted: boolean;
  presetModel: any;
  accounts: Array<any> = [];
  shippingServicesData: Array<any> = [];
  internationalShippingServicesData: Array<any> = [];
  domesticReturnPolicyEnabled: boolean = true;
  internationalReturnPolicyEnabled: boolean = true;
  shippingLocations: Array<any> = [];
  countries: Array<any> = [];
  ebayPresetData: any = {};
  isLocationEnabled: boolean = true;
  showShippingServiceControls: boolean = true;
  InterntlShippingTypeData: Array<any> = [];
  shippingServiceData: ShippinServicesModel[] = [
    {
      presetMapId: [0],
      service: '',
      location: '',
      mode: '',
      cost: '',
      eachAdditional: '',
    },
  ];
  dataSource = new BehaviorSubject<AbstractControl[]>([]);
  displayColumns = [
    'service',
    'location',
    'mode',
    'cost',
    'eachAdditional',
    'actions',
  ];
  rows: FormArray = this.formBuilder.array([]);
  intshippingServiceData: ShippinServicesModel[] = [
    {
      presetMapId: [0],
      service: '',
      location: '',
      mode: '',
      cost: '',
      eachAdditional: '',
    },
  ];
  intdataSource = new BehaviorSubject<AbstractControl[]>([]);
  introws: FormArray = this.formBuilder.array([]);
  showIntShippingServiceControls: boolean = true;
  ebayPaymentMethods: Array<any> = [];
  showPaypalEmail: boolean = false;
  accountSelected: boolean = false;
  shippingPresetsToDelete: Array<any> = [];
  eBayListingDuration: Array<any> = [];
  eBayListingStyle: Array<any> = [];
  0;

  constructor(
    private formBuilder: FormBuilder,
    private listingService: ListingService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private userService: UsersService,
    public permissionsHelper: PermissionsHelper
  ) {
    this.userData = JSON.parse(localStorage.getItem('currentUser'))
      ? localStorage.getItem('currentUser')
      : sessionStorage.getItem('currentUser');
    this.getUserMarketplacesRegions();
    this.getDisplayColumns();
  }

  ngOnInit(): void {
    this.shippingPresetsToDelete = [];
    this.setupeBayFormGroup = this.formBuilder.group({
      presetId: [0],
      presetTitle: ['', Validators.required],
      dispatchDuration: ['', Validators.required],
      shippingType: ['', Validators.required],
      shippingServicesArray: this.formBuilder.array([this.createTableRow()]),
      itemLocation: ['', Validators.required],
      itemCity: [''],
      itemPostalCode: [''],
      internationalshippingType: [''],
      intshippingServicesArray: this.formBuilder.array([this.createTableRow()]),
      isPaypalAccepted: [false],
      paypalEmail: ['', Validators.required],
      paymentMethods: [],
      domesticReturnPolicy: ['', Validators.required],
      domesticPostage: [
        { value: '', disabled: this.domesticReturnPolicyEnabled },
        Validators.required,
      ],
      domesticReturnDuration: [
        { value: '', disabled: this.domesticReturnPolicyEnabled },
        Validators.required,
      ],
      internationalReturnPolicy: ['', Validators.required],
      internationalPostage: [
        { value: '', disabled: this.internationalReturnPolicyEnabled },
        Validators.required,
      ],
      internationalReturnDuration: [
        { value: '', disabled: this.internationalReturnPolicyEnabled },
        Validators.required,
      ],
      refundOption: [
        {
          value: '',
          disabled:
            this.internationalReturnPolicyEnabled ||
            this.domesticReturnPolicyEnabled,
        },
        Validators.required,
      ],
      itemBestOffer: [false],
      listingStyle: [''],
      listingDuration: [''],
    });

    this.updateView();
    this.updateIntView();
  }

  getDisplayColumns() {
    if (this.permissionsHelper.viewOnly('Listing to eBay')) {
      this.displayColumns = [
        'service',
        'location',
        'mode',
        'cost',
        'eachAdditional',
      ];
    }
  }
  getUserMarketplacesRegions() {
    this.listingService
      .getUserMarketplacesRegions(this.userData.companyId, Channels.eBay)
      .subscribe(
        (response) => {
          if (response.body.status == 200) {
            this.accounts = response.body.data;
          } else {
            this.notificationService.Error(response.body.message);
          }
        },
        (error) => {
          this.notificationService.Error(error.message);
        }
      );
  }

  /* Handle acount change event*/
  handleAccountChange(event) {
    this.userMarketplace = this.accounts.find(
      (x) => x.userMarketplaceSiteMapId == event.value
    );
    this.accountSelected = true;

    this.getEBayGlobalMasterData();
    // this.getEbayShippingServices();
    this.getEbayShippingLocations();
    this.getCountries();
    this.getInternationalShippingTypeData();
    this.getEbayPaymentMethods();
    this.getEbayPresetDetails();
    this.geteBayListingStyle();
    this.geteBayListingDuration();
  }

  // To get eBay ListingDuration
  geteBayListingDuration() {
    this.listingService.geteBayListingDuration().subscribe(
      (response) => {
        if (response != null && response.body.status == 200) {
          this.eBayListingDuration = response.body.data;
          this.eBayListingDurationFiltered = this.eBayListingDuration;
        } else {
          this.notificationService.Error(response.body.message);
        }
      },
      (error) => {
        // this.notificationService.Error(error.message);
      }
    );
  }

  // To eBay ListingStyle
  geteBayListingStyle() {
    this.listingService.geteBayListingStyle().subscribe(
      (response) => {
        if (response != null && response.body.status == 200) {
          this.eBayListingStyle = response.body.data;
        } else {
          this.notificationService.Error(response.body.message);
        }
      },
      (error) => {
        //this.notificationService.Error(error.message);
      }
    );
  }

  handleListingStyleChange(event) {
    if (event.value === 'FixedPriceItem') {
      this.eBayListingDurationFiltered = this.eBayListingDuration.filter(
        (c) => c.text === 'GTC'
      );
    } else {
      this.eBayListingDurationFiltered = this.eBayListingDuration.filter(
        (c) => c.text !== 'GTC'
      );
    }
  }

  getEbayPresetDetails() {
    this.listingService
      .getEbayPresetDetails(
        this.userData.companyId,
        this.userMarketplace.globalMarketplaceId
      )
      .subscribe((response) => {
        if (response.status == 200) {
          this.ebayPresetData = response.body.data;

          if (this.ebayPresetData != null) {
            let event = { value: this.ebayPresetData.shippingType };
            this.handleShippingTypeChange(event);
            let evt = { value: this.ebayPresetData.internationalShippingType };
            this.handleInternationalShippingTypeChange(evt);
            if (this.ebayPresetData.domesticReturnPolicy == '17') {
              this.domesticReturnPolicyEnabled = false;
            } else {
              this.domesticReturnPolicyEnabled = true;
            }
            if (this.ebayPresetData.internationalReturnPolicy == '17') {
              this.internationalReturnPolicyEnabled = false;
            } else {
              this.internationalReturnPolicyEnabled = true;
            }

            if (this.ebayPresetData.shippingServicesArray != null)
              this.shippingServiceData = this.ebayPresetData.shippingServicesArray;
            if (this.ebayPresetData.intshippingServicesArray != null)
              this.internationalShippingServicesData = this.ebayPresetData.intshippingServicesArray;

            this.shippingServiceData.forEach((d: ShippinServicesModel) =>
              this.addShippingServiceRow(false, d)
            );
            this.intshippingServiceData.forEach((d: ShippinServicesModel) =>
              this.addShippingServiceRow(true, d)
            );

            this.changeValue({ checked: this.ebayPresetData.isPaypalAccepted });
            this.setupeBayFormGroup.patchValue(this.ebayPresetData);
          } else {
            this.shippingServiceData.forEach((d: ShippinServicesModel) =>
              this.addRow()
            );
            this.intshippingServiceData.forEach((d: ShippinServicesModel) =>
              this.addIntRow()
            );
          }
        }
      });
  }

  addShippingServiceRow(isInternational, d?: ShippinServicesModel) {
    const row = this.formBuilder.group({
      presetMapId: [0],
      service: ['', [Validators.required]],
      location: [{ value: '', disabled: this.isLocationEnabled }, []],
      mode: ['', []],
      cost: ['', []],
      eachAdditional: ['', []],
    });
    if (isInternational) {
      const frmArry = this.setupeBayFormGroup.get(
        'intshippingServicesArray'
      ) as FormArray;
      this.isLocationEnabled = true;
      frmArry.push(row);
      if (d == undefined) this.addIntRow();
      else this.addIntRow(d, false);
    } else {
      const frmArry = this.setupeBayFormGroup.get(
        'shippingServicesArray'
      ) as FormArray;
      this.isLocationEnabled = false;
      frmArry.push(row);
      //this.addRow();
      if (d == undefined) this.addRow();
      else this.addRow(d, false);
    }
  }

  deleteRow(index, isInternationalArray) {
    let i = index;
    if (isInternationalArray) {
      let frmArry = this.setupeBayFormGroup.get(
        'intshippingServicesArray'
      ) as FormArray;
      let val = frmArry.controls[index].value.presetMapId;

      this.shippingPresetsToDelete.push(val);
      // frmArry.removeAt(index);
      this.introws.removeAt(index);
      this.updateIntView();
    }
    {
      let frmArry = this.setupeBayFormGroup.get(
        'shippingServicesArray'
      ) as FormArray;
      let val = frmArry.controls[index].value.presetMapId;
      this.shippingPresetsToDelete.push(val);
      //frmArry.removeAt(index);
      this.rows.removeAt(index);
      this.updateView();
    }
  }

  addRow(d?: ShippinServicesModel, noUpdate?: boolean) {
    const row = this.formBuilder.group({
      presetMapId: [d && d.presetMapId ? d.presetMapId : null],
      service: [d && d.service ? d.service : null, [Validators.required]],
      location: [d && d.location ? d.location : null, []],
      mode: [d && d.mode ? d.mode : null, []],
      cost: [d && d.cost ? d.cost : null, []],
      eachAdditional: [d && d.eachAdditional ? d.eachAdditional : null, []],
    });
    this.rows.push(row);
    if (!noUpdate) {
      this.updateView();
    }
  }
  addIntRow(d?: ShippinServicesModel, noUpdate?: boolean) {
    //const userCtrl = this.setupeBayFormGroup.get('shippingServicesArray') as FormArray;
    const row = this.formBuilder.group({
      service: [d && d.service ? d.service : null, [Validators.required]],
      location: [
        {
          value: d && d.location ? d.location : null,
          disabled: this.isLocationEnabled,
        },
        [],
      ],
      mode: [d && d.mode ? d.mode : null, []],
      cost: [d && d.cost ? d.cost : null, []],
      eachAdditional: [d && d.eachAdditional ? d.eachAdditional : null, []],
    });
    this.introws.push(row);
    if (!noUpdate) {
      this.updateIntView();
    }
  }

  updateIntView() {
    this.intdataSource.next(this.introws.controls);
  }
  updateView() {
    this.dataSource.next(this.rows.controls);
  }
  createTableRow(): FormGroup {
    return this.formBuilder.group({
      presetMapId: [0],
      service: ['', Validators.required],
      location: [''],
      cost: [''],
      mode: [''],
      eachAdditional: [''],
    });
  }

  onCancelClick(): void {
    //this.dialogRef.close();
  }

  public nextStep() {
    this.selectedIndex += 1;
  }

  previousStep() {
    this.selectedIndex -= 1;
  }

  //Get from controls
  get formControls() {
    return this.setupeBayFormGroup.controls;
  }

  handleDomesticReturnUpdate(event) {
    if (event.value == '17') this.domesticReturnPolicyEnabled = false;
    else this.domesticReturnPolicyEnabled = true;
  }
  handleInternationalReturnUpdate(event) {
    if (event.value == '17') this.internationalReturnPolicyEnabled = false;
    else this.internationalReturnPolicyEnabled = true;
  }

  getInternationalShippingTypeData() {
    this.InterntlShippingTypeData = [
      { value: 1, desc: 'No International postage' },
      { value: 2, desc: 'flat: same to all customers' },
    ];
  }

  handleShippingTypeChange(event) {
    let shippingTypeId = event.value;
    if (this.ebayShippingTypes.length > 0) {
      let shippingTypeVal = this.ebayShippingTypes.find(
        (x) => x.eBayMasterGlobalDataId == shippingTypeId
      );
      this.getEbayShippingServices(shippingTypeVal.eBayMasterGlobalDataValue);
    }
    if (
      shippingTypeId == '11' ||
      shippingTypeId == '13' ||
      shippingTypeId == '15'
    ) {
      this.showShippingServiceControls = false;
    } else {
      this.showShippingServiceControls = true;
    }
  }

  changeValue(event) {
    this.showPaypalEmail = event.checked;
  }

  handleInternationalShippingTypeChange(event) {
    //this.showIntShippingServiceControls=!this.showIntShippingServiceControls;

    let intShippingTypeId = event.value;
    if (intShippingTypeId == 2) {
      this.showIntShippingServiceControls = false;
      this.getEbayShippingServices(0);
    } else {
      this.showIntShippingServiceControls = true;
    }
  }

  getCountries() {
    this.userService.getCountries().subscribe(
      (response) => {
        if (response.body.data !== null) {
          this.countries = response.body.data;
        } else {
          console.log('this.message', response.body.message);
        }
      },
      (error) => {
        console.log('this.error', error);
      }
    );
  }

  getEbayPaymentMethods() {
    this.listingService.getEbayPaymentMethodsData().subscribe(
      (response) => {
        if (response.status == 200) {
          this.ebayPaymentMethods = response.body.data;
        } else {
          console.log(response.body.message);
        }
      },
      (err) => {
        console.log(err.message);
      }
    );
  }
  // To get eBay categories
  getEBayGlobalMasterData() {
    this.listingService.getEbayGlobalMasterData().subscribe(
      (response) => {
        if (response.body.status == 200) {
          this.ebayGlobalMasterData = response.body.data;
          this.ebayShippingDurations = this.ebayGlobalMasterData.shippingDurations;
          this.ebayShippingTypes = this.ebayGlobalMasterData.shippingTypes;
          this.ebayReturnsWhitinOptions = this.ebayGlobalMasterData.returnsWithinOptions;
          this.ebayReturnPolicies = this.ebayGlobalMasterData.returnPolicies;
          this.ebayReturnCostPaidBy = this.ebayGlobalMasterData.returnCostPaidBy;
          this.ebayRefundOptions = this.ebayGlobalMasterData.refundOptions;
        } else {
          this.notificationService.Error(response.body.message);
        }
      },
      (error) => {
        this.notificationService.Error(error.message);
      }
    );
  }

  getEbayShippingServices(shippinTypeId) {
    this.listingService.getEbayShippingServicesData(shippinTypeId).subscribe(
      (response) => {
        if (response.status == 200) {
          if (shippinTypeId > 0) this.shippingServicesData = response.body.data;
          if (shippinTypeId == 0) {
            this.internationalShippingServicesData = response.body.data;
          }
        } else {
          console.log(response.body.message);
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  getEbayShippingLocations() {
    this.listingService.getEbayShippingLocationData().subscribe(
      (response) => {
        if (response.status == 200) {
          this.shippingLocations = response.body.data;
        } else {
          console.log(response.body.message);
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  }
  handlePaymentMethodChange(event) {
    this.paymentPresets.push(event.value);
  }
  //To save category & aspects
  onSubmit() {
    // if (this.setupeBayFormGroup.invalid) {
    //   return;
    // }
    // else {
    this.submitted = true;
    let postData = this.setupeBayFormGroup.getRawValue();
    postData.companyId = this.userData.companyId;
    postData.ebaySiteCode = this.userMarketplace.globalMarketplaceId;
    if (this.ebayPresetData != null) {
      postData.presetId = this.ebayPresetData.presetId;
      postData.presetPaymentMapId = this.ebayPresetData.presetPaymentMapId;
    }
    if (this.shippingPresetsToDelete.length > 0) {
      postData.shippingPresetsToDelete = this.shippingPresetsToDelete;
    } else {
      postData.shippingPresetsToDelete = [];
    }
    if (postData.domesticReturnPolicy == '18') {
      postData.domesticReturnDuration = null;
      postData.domesticPostage = null;
    }
    if (postData.internationalReturnPolicy == '18') {
      postData.internationalReturnDuration = null;
      postData.internationalPostage = null;
    }

    if (
      postData.domesticReturnPolicy == '18' &&
      postData.internationalReturnPolicy == '18'
    ) {
      postData.refundOption = null;
    }

    this.listingService.saveUpdateeBayPreset(postData).subscribe(
      (response) => {
        if (response.body.status === 200) {
          this.notificationService.Success(response.body.message);
          //this.dialogRef.close();
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
