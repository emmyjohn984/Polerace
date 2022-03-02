import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../services/users.service';
import { MustMatch } from 'src/app/shared/MustMatch';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  userData: any;
  submitted: boolean = false;
  constructor(private router: Router, public fb: FormBuilder, public userService: UsersService, public toastrService: ToastrService) { }

  ngOnInit(): void {
    this.userData = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : JSON.parse(sessionStorage.getItem('currentUser'));

    this.changePasswordForm = this.fb.group({
      email: [this.userData.email],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  onSubmit() {
    this.submitted = true;
    if (!this.changePasswordForm.invalid) {
      this.userService.updatePassword(this.changePasswordForm.value).subscribe(res => {
        if (res.body.status == 200) {
          this.toastrService.success(res.body.message)
          this.router.navigateByUrl('/settings/update-profile')
        } else {
          this.toastrService.error(res.body.message);
        }
      }, err => {
        this.toastrService.error('Password is not updated');
        this.changePasswordForm.reset();

      })
    }
  }
  get f() {
    return this.changePasswordForm.controls;
  }

}


