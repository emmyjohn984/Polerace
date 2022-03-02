import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { AuthService } from 'src/app/auth/service/auth.service';

@Component({
  selector: 'app-retrivepassword',
  templateUrl: './retrivepassword.component.html',
  styleUrls: ['./retrivepassword.component.scss']
})
export class RetrivepasswordComponent implements OnInit {

  constructor( private authService: AuthService, private notificationService:NotificationService,private router:Router) { }

  ngOnInit(): void {
  }

  verifyAndSendResetPwdMail(f:NgForm) {
    let postdata = f.value;
    this.authService.verifyUserAndSendResetLink(postdata.email).subscribe((res)=>{
      this.notificationService.Success("Reset password link sended successfully .");
    },(err)=>{
      // alert(err.error.data);
      this.notificationService.Error("Error in sending link.")
    })
  }

  redirect(){
    this.router.navigateByUrl('auth/login');
  }


}
