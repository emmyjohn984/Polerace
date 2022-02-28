import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/service/auth.service';
import '../../../models/register';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  sid: number = 2;
  dt: any;
  dataDisplay: any;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  diameter: number = 150;
  strokeWidth: number = 7;
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  addData(f: NgForm) {
    this.loading = true;
    this.authService.register(f.value).subscribe(
      (res) => {
        if (res) {
          this.notificationService.Success('Register Successfully.');
          this.router.navigateByUrl('/auth/login');
        }
        this.loading = false;
      },
      (err) => {
        console.log(err);
        if (err.status === 500) {
          this.notificationService.Error(err.error);
        } else {
          this.notificationService.Error(
            'Something went wrong. Please try again later.'
          );
        }
        this.loading = false;
      }
    );
  }
}
