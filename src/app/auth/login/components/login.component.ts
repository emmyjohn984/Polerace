import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/common-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  forgotPwdForm: FormGroup;
  submitted = false;
  returnUrl: string;
  error = '';
  showForgotForm: boolean = false;
  showMsg: string = '';
  userdata: String;
  loading: boolean = false;
  e: any;
  remberme: boolean = false;

  constructor(
    private router: Router,
    public fb: FormBuilder,
    private authService: AuthService,
    private commonService: CommonServiceService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private toasterservice: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      rememberme: [false],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  addData(f) {
    this.loading = true;
    if (this.loginForm.invalid) {
      this.submitted = true;
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.controls[key].markAsDirty();
      });
      this.loading = false;
      return;
    } else {
      this.userdata = this.loginForm.value;
      this.authService.login(this.userdata).subscribe(
        (res) => {
          console.log(this.loginForm.value)
          if (res.body.data) {
            if (this.loginForm.value.rememberme) {
              localStorage.setItem('token', res.body.data.accessToken);
              localStorage.setItem(
                'currentUser',
                JSON.stringify(res.body.data.userInfo)
              );
              this.loading = false;
            }else{
              sessionStorage.setItem('token', res.body.data.accessToken);
              sessionStorage.setItem(
                'currentUser',
                JSON.stringify(res.body.data.userInfo)
              );
              this.loading = false;
            }
            // this.submitted = false;
            // let landingPage = res.body.data.userInfo.groups.filter(c => c.moduleName.toLowerCase() == 'admindashboard' && (c.delete == true || c.isEdit == true || c.view == true));
            // if (landingPage.length > 0 || res.body.data.userInfo.roleName.toLowerCase() == "super admin" || res.body.data.userInfo.roleName.toLowerCase() == "admin") {
            if (res.body.data.userInfo.roleId == 3) {
              this.router.navigateByUrl('/dashboard/admindashboard');
              this.loading = false;
            } else {
              this.router.navigateByUrl('/dashboard/staffdashboard');
              this.loading = false;
            }
          } else {
            this.toasterservice.error(res.body.message);
            this.submitted = false;
            this.loading = false;
          }
        },
        (error) => {
          console.log(error);
          this.toasterservice.error(
            'Something went wrong. Please try again later.'
          );
          this.submitted = false;
          this.loading = false;
        }
      );
    }
  }
}
