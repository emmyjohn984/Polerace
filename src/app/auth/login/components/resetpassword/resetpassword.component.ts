import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/service/auth.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {

  uid:any;
  href:any;
  GUID:any;

  constructor( private router:Router, private authService:AuthService, private notificationService: NotificationService) { }

  ngOnInit(): void {

      this.href = this.router.url.split('=')[1];
 

  }

  ResetPassword(f:NgForm){
    
    this.authService.resetPassword(f.value).subscribe((res)=>{
     
      this.notificationService.Success("Password Changed Successfully .");
      // alert('register successsfully');
    },(err)=>{
      // alert(err.error.data);
      this.notificationService.Error("Error in changing password .")
    })
  }

}
