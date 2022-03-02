import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})

export class AddUsersComponent implements OnInit {

  userForm: FormGroup;
  roles: Array<any> = [];
  submitted: boolean = false;
  readonly: boolean = false;
  userId: number = 0;
  sub: any;
  user: any = {};
  groups: Array<any> = [];
  filteredGroups: Array<any> = [];
  countries: any;
  states: any;
  userData: any;


  constructor(private router: Router, private userService: UsersService, private formBuilder: FormBuilder, private notificationService: NotificationService
    , private route: ActivatedRoute) {
  //  this.getRoles();
   // this.getGroups();
    this.getCountries();
    this.initializeFormControls();
  }


  ngOnInit() {
    this.readQuery();
     this.userData = JSON.parse(localStorage.getItem('currentUser')?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser'));
     this.getRoles(this.userData.companyId);
     this.getGroups(this.userData.companyId);
    if (this.userId) {
      this.getUserByUserId(this.userId)
    }
  }

  //To read query string values
  private readQuery() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.userId = params['userId'];
      });
  }

  //To get user by user id
  getUserByUserId(userId: number) {
    this.userService.getUserByUserId(userId).subscribe(response => {
      if (response.body.data !== null) {
        this.user = response.body.data;
        this.readonly=true;
        this.getStates(this.user.countryId);
        this.user.password = this.user.password.substr(0,6);
        this.userForm.patchValue(this.user);
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      console.log('this.error', error);
    });
  }

  //Unsubscribe
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  //Initialize form controls
  private initializeFormControls() {
    this.userForm = this.formBuilder.group({
      userId: [0],
      email: ['', [Validators.required, Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      roleId: ['', Validators.required],
      groupId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      isActive: [true, Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      countryId: ['', Validators.required],
      stateId: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(6)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]]
    });
  }

  //Get from controls
  get formControls() {
    return this.userForm.controls;
  }

   //Roles change event
   onRolesChange(event) {
    let roleId = event.value;
    if (roleId) {
      this.filteredGroups=this.groups.filter(x=>x.roleId===roleId);
    }
  }

  //To get roles
  getRoles(companyId) {
    this.userService.getRolesByCompanyId(companyId).subscribe(response => {
      if (response.body.data !== null) {
        this.roles = response.body.data;
      }
      else {
        console.log("this.message", response.body.message);
      }
    }, error => {
      console.log('this.error', error);
    });
  }

   //To get groups
   getGroups(companyId) {
    this.userService.getGroupsByCompanyId(companyId).subscribe(response => {
      if (response.body.data !== null) {
        this.groups = response.body.data;
        this.filteredGroups=this.groups;
      }
      else {
        console.log("this.message", response.body.message);
      }
    }, error => {
      console.log('this.error', error);
    });
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

  validateNumberInput(e) {
    if (e.target.attributes.id.value === 'phone')
      this.userForm.get('phone').setValue(e.target.value.match(/[0-9]*/))
    else if (e.target.attributes.id.value === 'fax')
      this.userForm.get('fax').setValue(e.target.value.match(/[0-9]*/))
    else if (e.target.attributes.id.value === 'postalCode')
      this.userForm.get('postalCode').setValue(e.target.value.match(/[0-9]*/))
  }

  //To submit
  onSubmit() {
  //  if (!this.userForm.invalid) {
      this.submitted = true;
      let postData = this.userForm.value;
      postData.companyId = this.userData.companyId;
      postData.phone= postData.phone[0];
      postData.postalCode= postData.postalCode[0];
      postData.IsUserModified = true;
      this.userService.createUpdateUser(postData).subscribe(response => {
        if (response.body.status === 200) {
          this.notificationService.Success(response.body.message);
          this.router.navigate(['./settings/manageusers']);
        }
        else {
          this.notificationService.Error(response.body.message);
        }
      }, error => {
        console.log('this.error', error);
        this.notificationService.Error(error);
      });
    //}
  }




}
