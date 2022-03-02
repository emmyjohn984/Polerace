import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { post } from 'jquery';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { UsersService } from 'src/app/Platform/settings/services/users.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
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
  Edit: boolean = false;
  loading:boolean = false;
  subscriptions:any;

  constructor(private router: Router, private userService: UsersService, private formBuilder: FormBuilder,
    private notificationService: NotificationService
    , private route: ActivatedRoute) {
  //  this.getRoles();
   // this.getGroups();
    this.getCountries();
    this.initializeFormControls();
    this.getSubscriptions();
  }


  ngOnInit() {
    this.readQuery();
     this.userData = JSON.parse(localStorage.getItem('currentUser')?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser'));
     this.getRoles(this.userData.companyId);
    //  this.getGroups(this.userData.companyId);
    this.getSubscriptions();
    if (this.userId>0) {
      this.loading=true;
      this.getUserByUserId(this.userId);
      this.Edit = true;
    }
    this.loading = false;
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
    this.userService.getUserByUserId(userId).subscribe(async(response) => {
      if (response.body.data) {
        this.loading=false;
        await this.getSubscriptionById(response.body.data.subscriptionId);
        this.user = response.body.data;
        this.readonly=true;
        await this.getStates(this.user.countryId);
        this.user.password = this.user.password.substr(0,6);
        await this.userForm.patchValue(this.user);
      }
      else {
        this.notificationService.Error(response.body.message);
        this.loading=false;
      }
    }, error => {
      this.loading=false;
      this.notificationService.Error("Something went wrong. Please try again later.");
    });
  }

  //Unsubscribe
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  //Initialize form controls
  private initializeFormControls() {
    this.userForm = this.formBuilder.group({
      companyId:[],
      userId: [0],
      email: ['', [Validators.required, Validators.required, Validators.email]],
      password: [123456],
      roleId: [4],
      // groupId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      isActive: [true, Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      countryId: [ , Validators.required],
      stateId: [ , Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern("^[0-9]{5}(?:-[0-9]{4})?$")]],
      phone: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      subscriptionId: ['']
    });
  }

  //Get from controls
  get f() {
    return this.userForm.controls;
  }

   //Roles change event
   onRolesChange(event) {
    let roleId = event.target.value;
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
      }
    }, error => {
      console.log('this.error', error);
    });
  }

   //To get groups
  //  getGroups(companyId) {
  //   this.userService.getGroupsByCompanyId(companyId).subscribe(response => {
  //     if (response.body.data !== null) {
  //       this.groups = response.body.data;
  //       this.groups = [
  //         {groupId:2,groupName:'asds'},
  //         { groupId: 3, groupName: 'aasdsadbc' },

  //         {groupId:4,groupName:'asd'}
  //       ]
  //       this.filteredGroups=this.groups;
  //     }
  //     else {
  //       console.log("this.message", response.body.message);
  //     }
  //   }, error => {
  //     console.log('this.error', error);
  //   });
  // }

  //Country change
  onCountryChange(event) {
    let countryId = event.target.value;
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
      }
    }, error => {
      console.log('this.error', error);
    });
  }

  validateNumberInput(e) {
    // if (e.target.attributes.id.value === 'phone')
    //   this.userForm.get('phone').setValue(e.target.value.match(/[0-9]*/))
    // else if (e.target.attributes.id.value === 'fax')
    //   this.userForm.get('fax').setValue(e.target.value.match(/[0-9]*/))
    // else if (e.target.attributes.id.value === 'postalCode')
    //   this.userForm.get('postalCode').setValue(e.target.value.match(/[0-9]*/))
  }

  getSubscriptions(){
    this.userService.getAllSubscriptions().subscribe(res=>{
      this.subscriptions=res.body.data.data;
    })
  }

  getSubscriptionById(id){
    this.userService.getSubscriptionBySubscriptionId(id).subscribe(res=>{
      // this.subscriptionUpdateForm.get('SubscriptionId').setValue(id)
    })
  }

  onAdd(){
    let postData = this.userForm.value;
    postData.companyId = this.userData.companyId;
    postData.countryId = parseInt(postData.countryId)
    postData.stateId = parseInt(postData.stateId)
    postData.roleId = parseInt(postData.roleId)
    postData.subscriptionId = parseInt(postData.subscriptionId)
    postData.postal = parseInt(postData.subscriptionId)
    postData.postalCode = parseInt(postData.postalCode)
  }

  //To submit
  onSubmit() {
  this.submitted = true;
   if (!this.userForm.invalid) {
    let postData = this.userForm.value;
    postData.companyId = this.userData.companyId;
    postData.countryId = parseInt(postData.countryId)
    postData.stateId = parseInt(postData.stateId)
    postData.roleId = parseInt(postData.roleId)
    postData.phone = postData.phone.toString()
    postData.postalCode = parseInt(postData.postalCode)
      postData.IsUserModified = true;
      this.userService.createUpdateUser(postData).subscribe(response => {
        if (response.body.status === 200) {
          if(response.body.message==="Email already exist."){
            this.notificationService.Error("Email already exist.");
          }else{
            this.notificationService.Success(response.body.message);
            this.router.navigate(['./users/manage-user']);
          }
        }
        else {
          this.notificationService.Error(response.body.message);
        }
      }, error => {
        console.log('this.error', error);
        this.notificationService.Error("Something went wrong. Please try again later.");
      });
    }
  }




}
