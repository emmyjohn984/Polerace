import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionsHelper } from '../../helpers/permissions-helper';
import { CommonService } from 'src/app/Platform/settings/services/common.service';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/Platform/settings/services/users.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: any;
  CurrentUserRole: any;
  isSuperAdmin: boolean;
  channelsStatus: any = {};
  private subs: Subscription;
  imagePreview: string | ArrayBuffer;
  imagenotfound: string | ArrayBuffer;
  dataURL: string | ArrayBuffer;
  userData: any = {};
  user: any = {};
  states: Array<any> = [];
  countries: Array<any> = [];
  userId: number = 0;
  submitted: boolean = false;
  alterPassword: boolean = false;

  constructor(
    private router: Router,
    private notificationservice: NotificationService,
    private userService: UsersService,
    public permissonHelper: PermissionsHelper,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    if (this.currentUser != null) {
      this.CurrentUserRole = this.currentUser.roleName;
      this.isSuperAdmin =
        this.CurrentUserRole.toLowerCase() == 'super admin' ? true : false;
      this.subs = this.permissonHelper.notifyChannelsObservable.subscribe(
        (res) => {
          this.checkMarketplaceConfigured();
        }
      );
    } else {
      // this.notificationservice.Error("error in finding current user .")
    }

    this.userData = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    if (this.userData) {
      this.getUserByUserId(this.userData.userId);
    }
  }

  getUserByUserId(userId: number) {
    this.userService.getUserByUserId(userId).subscribe(
      (response) => {
        if (response.body.data.imageUrl !== null) {
          this.user = response.body.data;
          this.imagePreview = this.user.imageUrl;
        } else {
          this.imagenotfound;
        }
      },
      (error) => {
        console.log('this.error', error);
      }
    );
  }

  checkMarketplaceConfigured() {
    return this.commonService
      .checkMarketplaceConfigured(this.currentUser.companyId)
      .subscribe(
        (response) => {
          if (response.body.status == 200 && response.body.data != null) {
            this.channelsStatus = response.body.data;
          }
        },
        (error) => {
          console.log('this.error', error);
        }
      );
  }

  ngOnDestroy() {
    // this.subs.unsubscribe();
  }

  gotologin() {
    // debugger;
    this.router.navigate(['auth/login']);
  }

  //To logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.location.reload(); //workaround- need correction
    this.router.navigate(['./auth/login']);
  }
}
function e(e: any) {
  throw new Error('Function not implemented.');
}
