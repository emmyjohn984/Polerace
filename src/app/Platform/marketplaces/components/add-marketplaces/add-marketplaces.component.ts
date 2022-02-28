import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { MarketplacesService } from '../../services/marketplaces.service';

@Component({
  selector: 'app-add-marketplaces',
  templateUrl: './add-marketplaces.component.html',
  styleUrls: ['./add-marketplaces.component.scss'],
})
export class AddMarketplacesComponent implements OnInit {
  form: FormGroup;
  curUser;
  isEdit: boolean = false;
  submitted: boolean = false;
  globalmarket: any;
  globalsite: any;
  sub: any;
  loading: boolean = false;
  userMarketplaceId: number;
  userMarketplace: any;
  Edit: boolean = false;
  showAmazon: boolean = false;
  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private service: MarketplacesService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.curUser = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    this.form = this.fb.group({
      userMarketplaceId: [0],
      companyId: [this.curUser.companyId],
      globalMarketplaceId: ['', Validators.required],
      userMarketplaceName: ['', Validators.required],
      userAccessToken: ['', Validators.required],
      userMarketplaceURL: ['', Validators.required],
      amazonSellerID: [''],
      isAmazonBusiness: [true],
      isAmazonFBA: [true],
      salesTaxId: [0],
      refreshToken: [''],
      iseBay: [true],
      isOauth: [true],
      walmartClientId: [''],
      walmartClientSecret: [''],
      userMarketplaceSiteMapList: this.fb.array([]),
    });
    this.getMarket();
    this.getAllMarketPlace();
    this.getAllGlobalMarketplaceSiteData();
    this.readQuery();
    if (this.userMarketplaceId > 0) {
      this.loading = true;
      this.Edit = true;
      this.getUserMarketPlace(this.userMarketplaceId);
    }
  }

  // To read query string values
  private readQuery() {
    this.sub = this.route.queryParams.subscribe((parms) => {
      this.userMarketplaceId = parms['userMarketplaceId'];
    });
  }

  getUserMarketPlace(userMarketplaceId) {
    this.service.getUserMarketPlace(userMarketplaceId).subscribe(
      (response) => {
        if (response.body.data !== null) {
          this.userMarketplace = response.body.data;
          this.form
            .get('userMarketplaceId')
            .setValue(this.userMarketplace.userMarketplaceId);
          this.form
            .get('userMarketplaceName')
            .setValue(this.userMarketplace.userMarketplaceName);
          this.form
            .get('userAccessToken')
            .setValue(this.userMarketplace.userToken);
          this.form
            .get('userMarketplaceURL')
            .setValue(this.userMarketplace.userMarketplaceUrl);
          this.form
            .get('amazonSellerID')
            .setValue(this.userMarketplace.amazonSellerID);
          this.form
            .get('refreshToken')
            .setValue(this.userMarketplace.refreshToken);
          this.form
            .get('walmartClientId')
            .setValue(this.userMarketplace.walmartClientId);
          this.form
            .get('walmartClientSecret')
            .setValue(this.userMarketplace.walmartClientSecret);
          this.form
            .get('globalMarketplaceId')
            .setValue(this.userMarketplace.globalMarketplaceId);
          this.form.get('isOauth').setValue(this.userMarketplace.isOauth);
          this.form.get('iseBay').setValue(this.userMarketplace.iseBay);
          this.form.get('isOauth').setValue(this.userMarketplace.isOauth);
          this.form.get('isOauth').setValue(this.userMarketplace.isOauth);
          if (response.body.data.amazonSellerID != 0) {
            this.showAmazon = true;
          }
        } else {
          console.log('this.message', response.body.message);
        }
      },
      (error) => {
        this.notificationService.Error(error.message);
      }
    );
  }

  getAllMarketPlace() {
    this.service.getAllGlobalMarketPlace().subscribe(
      (res) => {
        if (res.body.data != null) {
          this.globalmarket = res.body.data;
        } else {
          this.notificationService.Info(res.body.message);
        }
      },
      (error) => {
        this.notificationService.Error(error.message);
      }
    );
  }

  getAllGlobalMarketplaceSiteData() {
    this.service.getAllGlobalMarketplaceSiteData().subscribe(
      (res) => {
        if (res.body.data != null) {
          this.globalsite = res.body.data;
        } else {
          this.notificationService.Info(res.body.message);
        }
      },
      (error) => {
        this.notificationService.Error(error.message);
      }
    );
  }

  get userMarket(): FormArray {
    return this.form.get('userMarketplaceSiteMapList') as FormArray;
  }

  userMarketForm(): FormGroup {
    return this.fb.group({
      userMarketplaceId: 0,
      globalMarketplaceSiteId: 0,
      globalMarketplaceSiteName: [''],
      regionCode: [''],
    });
  }
  getMarket() {
    return this.userMarket.push(this.userMarketForm());
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.form.invalid) {
      if (this.userMarketplaceId > 0) {
        this.service.createUpdateMarketplace(this.form.value).subscribe(
          (res) => {
            if (res.body.data != null) {
              this.notificationService.Success(res.body.message);
              this.router.navigate(['./marketplaces/marketplace-listing']);
            } else {
              this.notificationService.Info(res.body.message);
            }
          },
          (error) => {
            this.notificationService.Error(error.message);
            console.log(error);
          }
        );
      } else {
        this.service.createUpdateMarketplace(this.form.value).subscribe(
          (res) => {
            if (res.body.data != null) {
              this.notificationService.Success(res.body.message);
              this.router.navigate(['./marketplaces/marketplace-listing']);
            } else {
              this.notificationService.Info(res.body.message);
            }
          },
          (error) => {
            this.notificationService.Error(error.message);
            console.log(error);
          }
        );
      }
    }
  }

  onMarketPlaceChange(e) {
    if (e.target.value == 2) {
      this.showAmazon = true;
    } else {
      this.showAmazon = false;
      // this.form.get("amazonSellerID").setValue('');
    }
  }
}
