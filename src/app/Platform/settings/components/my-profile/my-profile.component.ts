import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  userForm: FormGroup;
  myProfile: FormGroup;
  userData: any = {};
  user: any = {};
  states: Array<any> = [];
  countries: Array<any> = [];
  userId: number = 0;
  submitted: boolean = false;
  alterPassword: boolean = false;
  imagePreview: string | ArrayBuffer;
  dataURL: string | ArrayBuffer;

  constructor(private router: Router, private userService: UsersService, private formBuilder: FormBuilder,
    private notificationService: NotificationService, private commonService: CommonService) {
    this.getCountries();
    this.initializeFormControls();
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('currentUser')?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser'));
    if (this.userData) {
    this.getUserByUserId(this.userData.userId);
    }
    else {
      this.router.navigate(['./dashboard']);
    }
  }

  showOptions(event: MatCheckboxChange): void {
    if (event.checked) {
      this.alterPassword = true;
      this.myProfile.controls['password'].setValidators([Validators.required]);
      this.myProfile.controls['confirmPassword'].setValidators([Validators.required]);
      //this.myProfile.controls['password'].setValue('');
      //this.myProfile.controls['confirmPassword'].setValue('');
      this.myProfile.controls['password'].updateValueAndValidity();
      this.myProfile.controls['confirmPassword'].updateValueAndValidity();
    }
    else {
      this.alterPassword = false;
      this.myProfile.controls['password'].clearValidators();
      this.myProfile.controls['confirmPassword'].clearValidators();
      this.myProfile.get('confirmPassword').setValidators(null);
      this.myProfile.get('password').setValidators(null);
      this.myProfile.get('password').setErrors(null);
      this.myProfile.get('confirmPassword').setErrors(null);
      this.myProfile.controls['password'].updateValueAndValidity();
      this.myProfile.controls['confirmPassword'].updateValueAndValidity();

    }
  }

  //To get user by user id
  getUserByUserId(userId: number) {
    this.userService.getUserByUserId(userId).subscribe(response => {
      if (response.body.data !== null) {
        this.user = response.body.data;
        this.user.password = this.user.password.substr(0, 6);
        this.getStates(this.user.countryId);
        this.imagePreview = this.user.imageUrl;
        this.myProfile.patchValue(this.user)
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      console.log('this.error', error);
    });
  }


  //Initialize form controls
  private initializeFormControls() {
    this.myProfile = this.formBuilder.group({
      userId: [0],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      tagLine: [''],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      countryId: ['', Validators.required],
      stateId: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.maxLength(6)]],
      phone: ['', [Validators.required, Validators.maxLength(11)]],
      alterPassword: [false, Validators.required],
      imageUrl: [''],
    },
      //{
      //   validator: this.confirmedValidator('password', 'confirmPassword')
      //}
    )
  }

  //To check confirm password
  confirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors({ confirmedValidator: false });
      }
    }
  }

  Updatepassword(e) {
    if (e) e.preventDefault();
    if (this.myProfile.controls["password"].value === '') {
      this.notificationService.Warning("Please input password first.")
    }
    else if (this.myProfile.controls["password"].value !== this.myProfile.controls["confirmPassword"].value) {
      this.notificationService.Warning(" Password and Confirm Password must be same.")
    }
    else {

      let postdata = {
        email: this.myProfile.controls["email"].value,
        password: this.myProfile.controls["password"].value
      };
      this.userService.updatePassword(postdata).subscribe(respone => {
        if (respone.body.status == 200) {
          this.notificationService.Success("Password has been updated successfully.")
        }
      }, error => {
        this.notificationService.Error(error.message);
      });
    }

  }

  //Get from controls
  get formControls() {
    return this.myProfile.controls;
  }

  validateNumberInput(e) {
    if (e.target.attributes.id.value === 'phone')
      this.myProfile.get('phone').setValue(e.target.value.match(/[0-9]*/))
    else if (e.target.attributes.id.value === 'fax')
      this.myProfile.get('fax').setValue(e.target.value.match(/[0-9]*/))
    else if (e.target.attributes.id.value === 'postalCode')
      this.myProfile.get('postalCode').setValue(e.target.value.match(/[0-9]*/))
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
    this.userService.getStates(countryId).subscribe(response => {
      if (response.body.data !== null) {
        this.states = response.body.data;
      }
      else {
        console.log("this.message", response.body.message);
      }
    }, error => {
      console.log('this.error', error);
    });
  }

  //To get countries
  getCountries() {
    this.userService.getCountries().subscribe(response => {
      if (response.body.data !== null) {
        this.countries = response.body.data;
      }
      else {
        console.log("this.message", response.body.message);
      }
    }, error => {
      console.log('this.error', error);
    });
  }

  //To submit
  onSubmit(event: any) {
    if (this.myProfile.invalid) {
      Object.keys
      (this.userForm.controls).forEach((key) => {
        this.userForm.controls[key].markAsDirty();
      });
      return;
    }
    this.submitted = true;
    let postData = this.myProfile.value;
    postData.companyId = this.userData.companyId;
    postData.postalCode = this.myProfile.value.postalCode.toString();
    postData.phone = this.myProfile.value.phone.toString();

    this.userService.createUpdateUser(postData).subscribe(response => {
      if (response.body.status === 200) {
        this.submitted = false;
        this.notificationService.Success(response.body.message);
        this.router.navigate(['./dashboard']);
      }
      else {
        this.submitted = false;
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.submitted = false;
      this.notificationService.Error(error.message);
    });
  }

  handleImageChange(e) {
    if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
      var input = e.target;
      var reader = new FileReader();
      reader.onload = () => {
        this.dataURL = reader.result;
        this.imagePreview = this.dataURL;
      };
      reader.readAsDataURL(input.files[0]);
    }
    else
      this.notificationService.Error("Please select valid file type");
  }

  uploadPhoto(e) {
    if (e) e.preventDefault();
    if (this.dataURL) {
      var postdata = {
        imageUrl: this.dataURL,
        userId: this.userData.userId,
        companyId: this.userData.companyId,

      };
      this.userService.uploadProfilePhoto(postdata).subscribe(respone => {
        if (respone.body.status == 200) {
          this.submitted = false;
          this.notificationService.Success("Photo has been updated successfully.")
        }
        else {
          this.notificationService.Error(respone.body.message)
        }
      }, error => {
        this.notificationService.Error(error.message)
      });
    }
    else
      this.notificationService.Error("Please select file first");

  }


}
