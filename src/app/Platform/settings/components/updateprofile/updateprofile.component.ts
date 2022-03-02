import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../services/users.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { SellersService } from '../../../sellers/services/sellers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.component.html',
  styleUrls: ['./updateprofile.component.scss'],
})
export class UpdateprofileComponent implements OnInit {
  userForm: FormGroup;
  companyForm: FormGroup;
  userData: any;
  image: any;
  imageToUpload: File;
  postData: any;
  companyinfo: any;
  states: Array<any> = [];
  countries: Array<any> = [];
  user: any;
  submitted: boolean = false;
  public submited: boolean = false;
  seller: any;
  sid: number = 2;
  dt: any;
  dataDisplay: any;
  loading: boolean = false;
  fname: String;
  lname: String;
  subscriptionPlans: any;
  subid: any;

  constructor(
    public fb: FormBuilder,
    private sellersService: SellersService,
    public router: Router,
    private notificationService: NotificationService,
    public userService: UsersService,
    public toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.userData = localStorage.getItem('currentUser')
      ? JSON.parse(localStorage.getItem('currentUser'))
      : JSON.parse(sessionStorage.getItem('currentUser'));
    this.userForm = this.fb.group({
      userId: [this.userData.userId],
      companyId: [this.userData.companyId],
      firstName: [
        '',
        [Validators.required, Validators.pattern("^[a-zA-Z -']+")],
      ],
      lastName: [
        '',
        [Validators.required, Validators.pattern("^[a-zA-Z -']+")],
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9 ]{10}')]],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', [Validators.required]],
      stateName: [''],
      countryId: ['', Validators.required],
      stateId: ['', Validators.required],
      countryName: [''],
      imageUrl: [this.userData.imageUrl],
      subscriptionId: [''],
    });

    this.companyForm = this.fb.group({
      userId: [this.userData.userId],
      companyId: [this.userData.companyId],
      companyName: [
        '',
        [Validators.required, Validators.pattern("^[a-zA-Z -']+")],
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9 ]{10}')]],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', [Validators.required]],
      stateId: ['', Validators.required],
      stateName: [''],
      countryName: [''],
      countryId: ['', Validators.required],
    });
    this.getCountries();
  }

  get f() {
    return this.userForm.controls;
  }

  get c() {
    return this.companyForm.controls;
  }

  //To get seller company by company id
  getSellerCompanyByCompanyId() {
    let companyId = this.userData.companyId;
    let userId = this.userData.userId;
    this.sellersService.getSellerByUserId(companyId, userId).subscribe(
      async (response) => {
        if (response.body.data !== null) {
          this.seller = response.body.data;
          await this.companyForm.patchValue(this.seller);
        } else {
          // this.notificationService.Error("No content");
        }
      },
      (error) => {
        this.notificationService.Error(
          'Something went wrong. Please try again later.'
        );
      }
    );
  }

  // post user details
  profileForm() {
    this.submitted = true;
    if (!this.userForm.invalid) {
      this.userService.createUpdateUser(this.userForm.value).subscribe(
        (response) => {
          if (response.body.status == 200) {
            if (localStorage.getItem('currentUser')) {
              this.userData.firstName = response.body.data.firstName;
              this.userData.lastName = response.body.data.lastName;
              //  localStorage.removeItem('currentUser');
              localStorage.setItem(
                'currentUser',
                JSON.stringify(this.userData)
              );
              this.router.navigate(['/']).then(() => {
                this.router.navigate(['settings/update-profile']);
              });
            } else {
              this.userData.firstName = response.body.data.firstName;
              this.userData.lastName = response.body.data.lastName;

              sessionStorage.setItem(
                'currentUser',
                JSON.stringify(this.userData)
              );
            }
            this.toastrService.success(response.body.message);
            this.getUserByUserId(this.userData.userId);
          }
        },
        (err) => {
          this.toastrService.error('failed to update');
        }
      );
    }
  }

  // post picture
  changePicture(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.image = reader.result as string;
        this.userService
          .uploadProfilePhoto({
            imageUrl: this.image,
            userId: this.userData.userId,
            companyId: this.userData.companyId,
          })
          .subscribe((res) => {
            this.toastrService.success('image Uploaded');
            this.router.navigate(['/']).then(() => {
              this.router.navigate(['settings/update-profile']);
            });
          });
        this.userForm.patchValue({
          imageUrl: this.image,
        });
      };
    }
  }

  // Post company data
  submitCompanyForm() {
    this.submited = true;
    if (!this.companyForm.invalid) {
      this.userService.updateCompanies(this.companyForm.value).subscribe(
        (response) => {
          if (response.body.status == 200) {
            this.toastrService.success(response.body.message);
          } else {
            this.toastrService.error(response.body.message);
          }
        },
        (err) => {
          this.toastrService.error(err);
        }
      );
    }
  }

  //To get states
  getStates(countryId) {
    this.userService.getStates(countryId).subscribe(
      (response) => {
        if (response.body.data !== null) {
          this.states = response.body.data;
        } else {
        }
      },
      (error) => {
        console.log('this.error', error);
      }
    );
  }

  getCountries() {
    this.loading = true;
    this.userService.getCountries().subscribe(
      async (response) => {
        await this.getUserByUserId(this.userData.userId);
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

  //Country change
  onCountryChange(event) {
    let countryId = event.target.value;
    if (countryId) {
      this.getStates(countryId);
    }
  }

  //To get user by user id
  getUserByUserId(userId: number) {
    this.userService.getUserByUserId(userId).subscribe(
      async (response) => {
        if (response.body.data !== null) {
          this.image = response.body.data.imageUrl;
          userprofile: response.body.data.imageUrl;
          this.user = response.body.data;
          this.fname = response.body.data.firstName;
          this.lname = response.body.data.lastName;
          this.user.password = this.user.password.substr(0, 6);
          await this.getStates(this.user.countryId);
          // this.imagePreview = this.user.imageUrl;
          await this.userForm.patchValue(this.user);
          await this.hideloader();
          await this.getSellerCompanyByCompanyId();
        } else {
          this.notificationService.Error(response.body.message);
        }
      },
      (error) => {
        console.log('this.error', error);
      }
    );
  }

  hideloader() {
    document.getElementById('loader').style.display = 'none';
    this.loading = false;
  }
}
