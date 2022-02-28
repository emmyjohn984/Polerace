import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { UsersService } from 'src/app/Platform/settings/services/users.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  userData: any;
  image: any;
  user: any;
  viewcat: boolean = false;
  viewsub: boolean = false;
  viewsup: boolean = false;
  sidebarToggled: boolean = false;
  count: number = 2;
  count1: number = 2;
  count2: number = 2;
  toglerCount: number = 2;
  date: Date;
  usermanagecount: number = 0

  constructor(private router: Router, private userService: UsersService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.userData = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : JSON.parse(sessionStorage.getItem('currentUser'));
    if (this.userData) {
      this.getUserByUserId(this.userData.userId);
    }
    this.getDate()
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUser');
    // this.router.navigate(['auth/login']);
    window.location.reload();
    // this.router.navigateByUrl('/home');
  }

  //To get user by user id
  getUserByUserId(userId: number) {
    this.userService.getUserByUserId(userId).subscribe(response => {
      if (response.body.data !== null) {
        userprofile: response.body.data.imageUrl
        this.user = response.body.data;
        this.user.password = this.user.password.substr(0, 6);
        this.image = response.body.data.imageUrl;
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      console.log('this.error', error);
    });
  }



  viewCategory() {
    if (this.count % 2 == 0) {
      this.viewcat = true;
      this.count++;
    } else {
      this.viewcat = false;
      this.count++;
    }

  }

  viewSubCategory() {
    if (this.count1 % 2 == 0) {
      this.viewsub = true;
      this.count1++;
    } else {
      this.viewsub = false;
      this.count1++;
    }
  }


  viewSupplier() {
    if (this.count2 % 2 == 0) {
      this.viewsup = true;
      this.count2++;
    } else {
      this.viewsup = false;
      this.count2++;
    }
  }


  togler() {
    if (this.toglerCount % 2 == 0) {
      this.sidebarToggled = true;
      this.toglerCount++;
    } else {
      this.sidebarToggled = false;
      this.toglerCount++;
    }
  }

  getDate() {
    this.date = new Date()
  }

  if(routerLinkActive = "active") {

  } 

  userMangement(event) {
    console.log(event.target.value);
  }

}
