import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { UsersService } from 'src/app/Platform/settings/services/users.service';
@Component({
  selector: 'app-update-user-subscription',
  templateUrl: './update-user-subscription.component.html',
  styleUrls: ['./update-user-subscription.component.scss']
})
export class UpdateUserSubscriptionComponent implements OnInit {
  submitted:boolean=false;
  subscriptionUpdateForm:FormGroup;
  sub:any;
  id:number=0;
  loading:boolean=false;
  subs:number
  subscriptions:any;
  start:any;
  end:any;
  subid:number;
  constructor(private formBuilder:FormBuilder,private userService:UsersService ,private router:Router,
    private notificationService:NotificationService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscriptionUpdateForm = this.formBuilder.group({
      UserId :[''],
      SubscriptionId :[''],
      userName :[''],
      validity :[''],
      subscriptionStart :[''],
      subscriptionEnd :[''],
    });
    this.readQuery()
    if (this.id>0) {
      this.getUserSubscriptionByUserId(this.id);
      // this.Edit = true;
    }
    this.getAllSubscriptions()
  }

  readQuery(){
    this.sub = this.route.queryParams
    .subscribe(params => {
      this.id = params['id'];
    });
  }

  getUserSubscriptionByUserId(id){
    this.userService.getSubscriptionByUser(id).subscribe(res=>{
      this.subs=res.body.data.subscriptionId;
      this.getSubscriptionById(this.subs);
      let datePipe: DatePipe = new DatePipe('en-US');
      this.start=datePipe.transform(res.body.data.subscriptionStart, 'MM/dd/yyyy');
      this.end=datePipe.transform(res.body.data.subscriptionEnd, 'MM/dd/yyyy');
      this.subscriptionUpdateForm.get('userName').setValue(res.body.data.userName);
      this.subscriptionUpdateForm.get('validity').setValue(res.body.data.validity);
      this.subscriptionUpdateForm.get('subscriptionStart').setValue(this.start);
      this.subscriptionUpdateForm.get('subscriptionEnd').setValue(this.end);
    })
  }

  getAllSubscriptions(){
    this.userService.getAllSubscriptions().subscribe(res=>{
      this.subscriptions=res.body.data.data;
    })
  }

  get f(){
    return this.subscriptionUpdateForm.controls;
  }

  getSubscriptionById(id){
    this.subid=id
    this.userService.getSubscriptionBySubscriptionId(id).subscribe(res=>{
      this.subscriptionUpdateForm.get('SubscriptionId').setValue(id)
    })
  }

  onSubmit(e){
    let subcid = this.subscriptionUpdateForm.value.SubscriptionId;
    const params = {"UserId":this.id,"SubscriptionId":subcid}
      this.userService.updateUserSubscription(params).subscribe(res=>{
        this.router.navigateByUrl("/users/subscribed-users");
        this.notificationService.Success(res.body.message)
      })
  }

}
