import { DatePipe } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-update-subscription',
  templateUrl: './update-subscription.component.html',
  styleUrls: ['./update-subscription.component.scss'],
})
export class UpdateSubscriptionComponent implements OnInit {
  submitted: boolean = false;
  subscriptionUpdateForm: FormGroup;
  sub: any;
  id: number = 0;
  loading: boolean = false;
  subs: number;
  postData: any;
  confirmation: any;
  subscriptions: any;
  start: any;
  end: any;
  subcid: any;
  userData: any;
  paymentHandler: any = null;
  payAmmount: number;
  payload: Array<any> = [];
  stripe_token: any;
  subid: any;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private router: Router,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.userData = localStorage.getItem('currentUser')
      ? JSON.parse(localStorage.getItem('currentUser'))
      : JSON.parse(sessionStorage.getItem('currentUser'));
    this.subscriptionUpdateForm = this.formBuilder.group({
      UserId: [this.userData.userId],
      SubscriptionId: [],
      userName: [''],
      validity: [''],
      subscriptionStart: [''],
      subscriptionEnd: [''],
      amount: [''],
      token: [''],
    });
    this.getAllSubscriptions();
    this.getUserSubscriptionByUserId(this.userData.userId);
    this.invokeStripe();
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key:
            'pk_test_51ILpJsFRXrII7xkxwrQpAr9ZIIGgBy4xiSC9Iv2pHOamjrEU1LRuzRrZAh8l2FXiaRIQjsCwYS2BWODYe5F3oTYs00aN68wZ8N',
          locale: 'auto',
          image: '/img/documentation/checkout/marketplace.png',
          token: function (stripeToken: any) {
            alert('Payment has been successfull!');
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }

  async initializePayment(amount: number = this.payAmmount) {
    const paymentHandler = await (<any>window).StripeCheckout.configure({
      key:
        'pk_test_51ILpJsFRXrII7xkxwrQpAr9ZIIGgBy4xiSC9Iv2pHOamjrEU1LRuzRrZAh8l2FXiaRIQjsCwYS2BWODYe5F3oTYs00aN68wZ8N',
      locale: 'auto',
      token: async (stripeToken: any) => {
        this.stripe_token = stripeToken.id;
        await this.updateSubscription();
      },
    });
    await paymentHandler.open({
      name: 'Polerace',
      description: 'Update subscription',
      amount: amount * 100,
    });
  }

  getUserSubscriptionByUserId(id) {
    this.userService.getSubscriptionByUser(id).subscribe(
      (res) => {
        this.loading = true;
        if (res) {
          this.subs = res.body.data?.subscriptionId;
          this.getSubscriptionById(this.subs);
          let datePipe: DatePipe = new DatePipe('en-US');
          this.start = datePipe.transform(
            res.body.data?.subscriptionStart,
            'MM/dd/yyyy'
          );
          this.end = datePipe.transform(
            res.body.data?.subscriptionEnd,
            'MM/dd/yyyy'
          );
          this.subscriptionUpdateForm
            .get('userName')
            .setValue(res.body.data?.userName);
          this.subscriptionUpdateForm
            .get('validity')
            .setValue(res.body.data?.validity);
          this.subscriptionUpdateForm
            .get('subscriptionStart')
            .setValue(this.start);
          this.subscriptionUpdateForm.get('subscriptionEnd').setValue(this.end);
          this.loading=false;
        } else {
          this.loading = false;
        }
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  getAllSubscriptions() {
    this.userService.getAllSubscriptions().subscribe(
      (res) => {
        this.loading = true;
        if (res) {
          this.loading = false;
          this.subscriptions = res.body.data.data;
        } else {
          this.loading = false;
        }
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  get f() {
    return this.subscriptionUpdateForm.controls;
  }

  getSubscriptionById(id) {
    this.subid = id;
    this.userService.getSubscriptionBySubscriptionId(id).subscribe((res) => {
      this.subscriptionUpdateForm.get('SubscriptionId').setValue(id);
      this.subscriptionUpdateForm.get('amount').setValue(res.body.data.amount);
      this.subscriptionUpdateForm
        .get('validity')
        .setValue(res.body.data.validity);
    });
  }

  onSubmit(e) {
    this.payAmmount = this.subscriptionUpdateForm.value.amount;
    this.initializePayment(this.payAmmount);
    this.postData = this.subscriptionUpdateForm.value;
    this.payload = this.subscriptionUpdateForm.value;
    this.subcid = this.subscriptionUpdateForm.value.SubscriptionId;
  }

  updateSubscription() {
    this.postData.token = this.stripe_token;
    this.userService.stripePayment(this.postData).subscribe((res) => {
      this.notificationService.Success(res.body.message);
      this.router.navigateByUrl('transaction/view-subscription-history')
    });
  }
}
