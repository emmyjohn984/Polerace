import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MarketplacesService } from '../../services/marketplaces.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { Channels } from 'src/app/shared/enums/channels';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { AddSalesTaxesDialogComponent } from '../add-sales-taxes-dialog/add-sales-taxes-dialog.component';

@Component({
  selector: 'app-amazon-configuration-dialog',
  templateUrl: './amazon-configuration-dialog.component.html',
  styleUrls: ['./amazon-configuration-dialog.component.scss']
})
export class AmazonConfigurationDialogComponent implements OnInit {
  setupAmazonFormGroup: FormGroup;
  fillAmazonInfoFormGroup: FormGroup;
  isEditable = false;
  isConnectedAmazon = false;
  AmazonMarketplaceSites: Array<any> = [];
  userData: any = {};
  salesTaxes: Array<any> = [];
  marketplaceSiteIDs: Array<any> = [];
  marketplaceSites: Array<any> = []
  regions: string = '';
  selectedMarketplaceRegion: any;
  constructor(public dialogRef: MatDialogRef<AmazonConfigurationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private marketplacesService: MarketplacesService, private notificationService: NotificationService, private router: Router, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.setupAmazonFormGroup = this.formBuilder.group({
      accountName: ['', Validators.required],
      globalMarketplaceSiteID: ['', Validators.required],
      salesTaxId: [''],
      isAmazonBusiness: [false],
      isAmazonFBA: [false],
    });

    this.fillAmazonInfoFormGroup = this.formBuilder.group({
      amazonSellerID: ['', Validators.required],
      MWSAuthToken: ['', Validators.required],

    });

    this.userData = JSON.parse(localStorage.getItem('currentUser')?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser'));
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  goForward(stepper: MatStepper) {
    stepper.next();
  }

  //Get from controls
  get formControls() {
    return this.setupAmazonFormGroup.controls;
  }
  get formControls1() {
    return this.fillAmazonInfoFormGroup.controls;
  }

  backToOverview() {
    this.isConnectedAmazon = false;
    this.setupAmazonFormGroup.markAsPristine();
    this.setupAmazonFormGroup.markAsUntouched();
    this.fillAmazonInfoFormGroup.markAsPristine();
    this.fillAmazonInfoFormGroup.markAsUntouched();
  }

  connectToAmazonPopupStep(index) {
    this.isConnectedAmazon = true;
    this.isEditable = true;
    this.getMarketplaceSites();
    this.getSalesTaxes();
  }

  getMarketplaceSites() {
    this.marketplacesService.getAmazonGlobalMarketplacesByChannelID(Channels.Amazon).subscribe(response => {
      if (response !== null && response.body.status == 200) {
        this.AmazonMarketplaceSites = response.body.data;
      }
      else {
        console.log("this.message", response.body.message);
      }
    }, error => {
      console.log("this.error", error.message);
    });
  }

  getSalesTaxes() {
    this.marketplacesService.getSalesTaxes(this.userData.companyId).subscribe(response => {
      if (response !== null && response.body.status == 200) {
        this.salesTaxes = response.body.data;
      }
      else {
        console.log("this.message", response.body.message);
      }
    }, error => {
      console.log("this.error", error.message);
    });
  }

  globalMarketplaceSiteChange(event) {
    this.regions = '';
    this.selectedMarketplaceRegion = this.AmazonMarketplaceSites.find(c => c.regionId == event.value);
    this.marketplaceSites = this.selectedMarketplaceRegion.globalMarketplaceSites;
    this.marketplaceSites.forEach(element => {
      this.regions += element.globalMarketplaceSiteName + ',';
    })
    let strCount = this.regions.length;
    this.regions = this.regions.substring(0, strCount - 1)
  }

  connectAmazonAccount() {
    let registerURL = 'https://sellercentral.amazon.com/gp/mws/registration/register.html';
    if (this.selectedMarketplaceRegion.regionCode.trim() == "EU") {
      registerURL = 'https://sellercentral.amazon.eu/gp/mws/registration/register.html';
    }
    else {
      registerURL = this.marketplaceSites.length > 0 ? this.marketplaceSites[0].globalMarketplaceSiteUrl : registerURL;
    }
    window.open(registerURL);
  }

  verifyAmazonSellerDetails() {
    if (this.fillAmazonInfoFormGroup.invalid)
      return;
    else {
      let amazonSellerDetails = this.fillAmazonInfoFormGroup.value;
      let postData = {
        sellerID: amazonSellerDetails.amazonSellerID,
        mwsAuthToken: amazonSellerDetails.MWSAuthToken,
        amazonSiteRegion: 'US'
      }
      this.marketplacesService.validateAmazonSellerDetails(postData).subscribe(response => {
        if (response !== null && response.body.status == 200) {
          this.createUpdateMarketplace();
        }
        else {
          this.notificationService.Error(response.body.message);
        }
      }, error => {
        this.notificationService.Error(error.message);
      });
    }
  }

  //To save marketplace
  createUpdateMarketplace() {
    let accountInfo = this.setupAmazonFormGroup.value;
    let amazonInfo = this.fillAmazonInfoFormGroup.value;

    let marketplaceSiteList = [];
    this.marketplaceSites.forEach(element => {
      let marketplaceSite = {
        globalMarketplaceSiteId: element.globalMarketplaceSiteId,
        regionCode: this.selectedMarketplaceRegion.regionCode
      };
      marketplaceSiteList.push(marketplaceSite);
    });

    let postData = {
      companyId: this.userData.companyId,
      globalMarketplaceId: Channels.Amazon,
      userMarketplaceName: accountInfo.accountName,
      salesTaxId: accountInfo.salesTaxId,
      AmazonSellerID: amazonInfo.amazonSellerID,
      UserAccessToken: amazonInfo.MWSAuthToken,
      isAmazonBusiness: accountInfo.isAmazonBusiness,
      isAmazonFBA: accountInfo.isAmazonFBA,
      clientId: null,
      clientSecret: null,
      userMarketplaceSiteMapList: marketplaceSiteList,
    }

    this.marketplacesService.createUpdateMarketplace(postData).subscribe(response => {
      if (response != null && response.body.status == 200) {
        this.dialogRef.close();
        this.notificationService.Success(response.body.message);
        this.router.navigate(['/marketplaces/managesaleschannels']);
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error(error.message);
    });
  }

  //Open add tax dialog
  openAddTaxDialog(): void {
    const dialogRef = this.dialog.open(AddSalesTaxesDialogComponent, {
      height: '300px',
      width: '400px',
      data: { companyId: this.userData.companyId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result.event == 'Add') {
        this.getSalesTaxes();
      }
    });
  }
}
