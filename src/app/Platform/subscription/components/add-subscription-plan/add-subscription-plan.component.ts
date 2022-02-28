import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { Observable } from 'rxjs';
import { SubscriptionServiceService } from '../../services/subscription-service.service';

@Component({
  selector: 'app-add-subscription-plan',
  templateUrl: './add-subscription-plan.component.html',
  styleUrls: ['./add-subscription-plan.component.scss'],
})
export class AddSubscriptionPlanComponent implements OnInit {
  subscriptionAddForm: FormGroup;
  readonly: boolean = false;
  categoryID: number = 0;
  currentUser: any = {};
  category: any = {};
  sub: any = {};
  isResetCategory: boolean = false;
  filteredCategories: Observable<any>;
  categories: Array<any> = [];
  loading: boolean = false;
  submitted: boolean = false;
  subscriptionID: number;
  Edit: boolean = false;

  constructor(
    private router: Router,
    private subscriptionService: SubscriptionServiceService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {
    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
  }

  ngOnInit(): void {
    this.initializeFormControls();
    this.readQuery();
    if (this.subscriptionID > 0) {
      this.Edit = true;
      this.loading = true;
      this.getSubscriptionById(this.subscriptionID);
    }
  }

  getSubscriptionById(subscriptionID) {
    this.subscriptionService.getSubscriptionById(subscriptionID).subscribe(
      async (response) => {
        if (response.body.status === 200 && response.body.data != null) {
          this.category = response.body.data;
          await this.subscriptionAddForm.patchValue(this.category);
          await this.hideloader();
        } else {
          this.notificationService.Error(response.body.message);
        }
      },
      (error) => {
        this.notificationService.Error(
          'Something went wrong, please try again later.'
        );
      }
    );
  }

  //To read query string values
  private readQuery() {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.subscriptionID = params['subscriptionID'];
    });
  }

  get formControls() {
    return this.subscriptionAddForm.controls;
  }

  resetAuto(name) {
    if (name === 'category') {
      this.isResetCategory = false;
      this.subscriptionAddForm.get('categoryName').setValue('');
    }
  }

  //Initialize form controls
  public initializeFormControls() {
    this.subscriptionAddForm = this.formBuilder.group({
      subscriptionTitle: ['', Validators.required],
      subscriptionType: [''],
      validity: ['', Validators.required],
      amount: ['', Validators.required],
    });
  }

  get f() {
    return this.subscriptionAddForm.controls;
  }

  onSubmit(event: any) {
    if (this.subscriptionAddForm.invalid) {
      this.submitted = true;
      Object.keys(this.subscriptionAddForm.controls).forEach((key) => {
        this.subscriptionAddForm.controls[key].markAsDirty();
      });
      return;
    } else {
      let postData = this.subscriptionAddForm.value;
      postData.id = this.subscriptionID;
      this.subscriptionService.createUpdateSubscription(postData).subscribe(
        (response) => {
          if (response.body.status === 200 && response.body.data != null) {
            this.notificationService.Success(
              'New Subscription has added successfully.'
            );
            this.router.navigate(['./subscription/subscription-listing']);
          } else {
            this.notificationService.Error(response.body.message);
          }
        },
        (error) => {
          this.notificationService.Error(
            'Something went wrong, please try again later.'
          );
        }
      );
    }
  }

  hideloader() {
    this.loading = false;
  }
}
