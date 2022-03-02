import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../services/customer.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-manage-customers',
  templateUrl: './manage-customers.component.html',
  styleUrls: ['./manage-customers.component.scss']
})

export class ManageCustomersComponent implements OnInit {
  balanceFrozen: boolean = false;
  users: Array<any> = [];
  form: FormGroup
  currentUser: any;
  suppliers: Array<any> = [];
  customers: any;
  userData: any = {};
  loading: boolean = false;
  dataSource: any;
  totalRecords: any;
  deleteId: number;
  companyid: number;
  userMarketPlace: any = '';
  filterusermarket: any;
  cols: any;
  keys: any;
  rowData: any = [];
  baseColoumns = [
    'customerName',
    'email',
    'userMarketPlace',
    'isActive',
    'createdDate'
  ];
  form1: FormGroup = new FormGroup({});

  constructor(private customerService: CustomerService, private toastrService: ToastrService, private notificationService: NotificationService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') ? localStorage.getItem('currentUser') : sessionStorage.getItem('currentUser'));
    this.companyid = this.currentUser.companyId;
    this.form1 = this.fb.group({
      columns: [this.baseColoumns],
    });

    this.cols = [
      { field: 'customerName', header: 'Customer Name'},
      { field: 'email', header: 'Email' },
      { field: 'userMarketPlace', header: 'User MarketPlace' },
      { field: 'isActive', header: 'Status' },
      { field: 'createdDate', header: 'Created Date' }
    ];          

    this.getCustomers();
    this.form = this.fb.group({
      toEmail: ['', Validators.required],
      subject: ['', Validators.required],
      body: ['', Validators.required]
    })
  }

  showId(customerId: number) {
    this.deleteId = customerId
  }

  view(customer) {
    this.router.navigate([`customers/viewCustomer/${customer}`])
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

  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne.id === objTwo.id;
    }
  }

  addColoumns(e?) {
    let Array = [];
    this.form1.value.columns.map((res) => {
      Array.push(res);
    });
    let columns = [];
    this.cols.map((res) => {
      columns.push(res.field);
    });

    let compare = Array.filter((val) => !columns.includes(val));
    compare.map(res => { this.baseColoumns.push(res) });

    compare.map((res) => {
      this.cols.push({ field: res, header: _.capitalize(res) });
    });

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

  //To get categories
  getCustomers() {
    this.loading = true;
    this.customerService.GetCustomerDataList(this.companyid).subscribe(response => {
      if (response.body.data !== null) {
        this.customers = response.body.data;
        this.dataSource = this.customers;
        this.totalRecords = this.customers.length;
        if (!this.keys) {
          this.keys = Object.keys(this.dataSource[0]);
          this.keys.sort()
          this.keys.map((res) => {
            this.rowData.push({ label: _.capitalize(res), value: res });
          });
        }
        this.filterusermarket = this.customers.filter(option => option.userMarketPlace != null);
        this.loading = false;
      }
      else {
      }
    }, error => {
      this.notificationService.Error("Something went wrong. Please try again later");
    });

  }

  deleteCustomer(customerId: number) {
    this.customerService.deleteCustomer(customerId).subscribe(response => {
      if (response.body.status == 200 && response.body.data != null) {
        this.notificationService.Success(response.body.message);
        this.getCustomers();
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error(error.message);
    });
  }

  editCustomer(customerId: number) {
    this.router.navigate(['/customers/addCustomer'], { queryParams: { customerId: customerId } });
  }

  filterReset() {
    this.userMarketPlace = '';
    this.getCustomers();
  }


  email(customers) {
    //  this.mailText = `mailto:${customers.email}.com?subject=files&body=`;
    this.form.get('toEmail').patchValue(customers.email);
  }
  get f() {
    return this.form.controls;
  }
  disableEmail: boolean = true;
  sendEmail() {
    this.loading = true;
    if (this.form.invalid) {
      Object.keys
        (this.form.controls).forEach((key) => {
          this.form.controls[key].markAsDirty();
        });
      this.loading = false;
      return
    }
    this.loading = false;
    this.customerService.sendEmail(this.form.value).subscribe(res => {
      if (res.status = 200) {
        this.toastrService.success(res.body.message)

      }
      else {
        this.toastrService.error(res.body.message)

      }
      this.reset();
    },
      err => {
        this.toastrService.error(err.body.title)

      })

  }
  reset() {
    this.form.reset();
  }
}
