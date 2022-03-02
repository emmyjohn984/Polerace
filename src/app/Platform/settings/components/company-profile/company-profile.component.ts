import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { SellersService } from '../../../sellers/services/sellers.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss'],
})
export class CompanyProfileComponent implements OnInit {
  companyProfile: FormGroup;
  states: Array<any> = [];
  submitted: boolean = false;
  userId: number = 0;
  seller: any = {};
  countries: Array<any> = [];
  userData: any = {};

  constructor(
    private router: Router,
    private userService: UsersService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private sellersService: SellersService
  ) {
    this.initializeFormControls();
    this.getCountries();
  }

  ngOnInit() {
    this.userData = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    if (this.userData) {
      // this.getSellerCompanyByCompanyId();
    } else {
      this.router.navigate(['./dashboard']);
    }
  }

  private initializeFormControls() {
    this.companyProfile = this.formBuilder.group({
      userId: [0],
      email: ['', [Validators.required, Validators.email]],
      companyName: ['', Validators.required],
      description: [''],
      websiteUrl: [''],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      countryId: ['', Validators.required],
      currencyId: ['', Validators.required],
      stateId: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.maxLength(6)]],
      phone: ['', [Validators.required, Validators.maxLength(11)]],
      fax: [''],
    });
  }

  //Get from controls
  get formControls() {
    return this.companyProfile.controls;
  }

  //Country change
  onCountryChange(event) {
    let countryId = event.value;
    if (countryId) {
      this.getStates(countryId);
    }
  }

  //To get states
  getStates(countryId) {
    this.userService.getStates(countryId).subscribe(
      (response) => {
        if (response.body.data !== null) {
          this.states = response.body.data;
        } else {
          console.log('this.message', response.body.message);
        }
      },
      (error) => {
        console.log('this.error', error);
      }
    );
  }

  //To get countries
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

  validateNumberInput(e) {
    if (e.target.attributes.id.value === 'phone')
      this.companyProfile.get('phone').setValue(e.target.value.match(/[0-9]*/));
    else if (e.target.attributes.id.value === 'fax')
      this.companyProfile.get('fax').setValue(e.target.value.match(/[0-9]*/));
    else if (e.target.attributes.id.value === 'postalCode')
      this.companyProfile
        .get('postalCode')
        .setValue(e.target.value.match(/[0-9]*/));
  }

  //To submit
  onSubmit(event: any) {
    if (this.companyProfile.invalid) {
      return;
    }
    let postData = this.companyProfile.value;
    postData.userId = this.userData.userId;
    postData.companyId = this.userData.companyId;
    postData.postalCode = this.companyProfile.value.postalCode.toString();
    postData.phone = this.companyProfile.value.phone.toString();
    postData.fax = this.companyProfile.value.fax.toString();
    this.sellersService.updateSeller(postData).subscribe(
      (response) => {
        if (response.body.status === 200) {
          this.notificationService.Success(response.body.message);
          this.router.navigate(['./dashboard']);
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
