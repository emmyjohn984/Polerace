import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { SubscriptionServiceService } from '../../services/subscription-service.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-subscription-listing',
  templateUrl: './subscription-listing.component.html',
  styleUrls: ['./subscription-listing.component.scss']
})
export class SubscriptionListingComponent implements OnInit {
  loading: boolean = false;
  plans: Array<any> = [];
  dataSource: any;
  totalRecords: number;
  subscriptionID: number;
  deleteId: number;
  cols: any;
  keys: any;
  rowData: any = [];
  baseColoumns = ['subscriptionTitle','subscriptionType','validity','amount']
  form: FormGroup = new FormGroup({});

  constructor(private subscriptionService: SubscriptionServiceService,private fb: FormBuilder, private notificationService: NotificationService, private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      columns: [this.baseColoumns],
    });
    this.cols = [
      { field: 'subscriptionTitle', header: 'Subscription Name' },
      { field: 'subscriptionType', header: 'Subscription Type' },
      { field: 'validity', header: 'Validity' },
      { field: 'amount', header: 'Amount' },
    ];
    this.getSubscription();
  }

  //To get subscriptionPlans
  getSubscription() {
    this.loading = true;
    this.subscriptionService.getSubscription().subscribe(res => {
      if (res.body.data !== null) {
        this.plans = res.body.data.data;
        this.hideloader();
        this.dataSource = this.plans;
        if (!this.keys) {
          this.keys = Object.keys(this.dataSource[0]);
          this.keys.sort();
          this.keys.map((res) => {
            this.rowData.push({ label: _.capitalize(res), value: res });
          });
        }
        this.totalRecords = this.plans.length;
      } else {
        this.notificationService.Error(res.body.data.message)
      }
    }, error => {
      this.notificationService.Error(error.message)
    })

  }

  addColoumns(e?) {
    let Array = [];
    this.form.value.columns.map((res) => {
      Array.push(res);
    });
    let columns = [];
    this.cols.map((res) => {
      columns.push(res.field);
    });

    let compare = Array.filter((val) => !columns.includes(val));

    compare.map((res) => {
      this.cols.push({ field: res, header: _.capitalize(res) });
    });
    compare.map(res=>{this.baseColoumns.push(res)});
    let eventArray = [];
    let unSelectValues = [];
    for (let i = 0; i < e.source.options._results.length; i++) {
      eventArray.push(e.source.options._results[i]);
      eventArray.map((res) => {
        if (!res._selected && columns.includes(res.value)) {
          unSelectValues.push(res.value);
        }
      });
    }
    let uniqueValues = [...new Set(unSelectValues)];
    if (uniqueValues.length) {
      uniqueValues.map((res) => {
        let indexOfCols = this.cols.findIndex((x) => x.field === res);
        if (indexOfCols > -1) {
          this.cols.splice(indexOfCols, 1);
        }
      });
    }
  }

  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne.id === objTwo.id;
    }
  }

  getData(value: any) {
    var formats = [
      moment.ISO_8601,
      "MM/DD/YYYY  :)  HH*mm*ss"
    ];
    let array = [];
    for (let i = 0; i < this.cols.length; i++) {
      if (!moment(value[this.cols[i].field], formats, true).isValid() || typeof value[this.cols[i].field] === 'number') {
        if(this.cols[i].field == 'isActive'){
          if(!!value[this.cols[i].field]){
            array.push('Active');
          }else{
            array.push('In-Active');
          }
        }else{
          array.push(value[this.cols[i].field]);
        }
      } else {
        array.push(moment(value[this.cols[i].field]).format('MM-DD-YYYY'));
      }
    }
    return array;
  }

  hideloader() {
    this.loading = false;
  }

  editSubscription(subscriptionID: number) {
    this.router.navigate(['/subscription/add-subscription'], { queryParams: { subscriptionID: subscriptionID } });
  }

  deleteSubscription(subscriptionID: number) {
    this.subscriptionService.deleteSubscriptionById(subscriptionID).subscribe(response => {
      if (response.body.status == 200 && response.body.data != null) {
        this.notificationService.Success(response.body.message);
        this.getSubscription();
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error(error.message);
    });
  }

  showId(subscriptionID: number) {
    this.deleteId = subscriptionID;
  }

}
