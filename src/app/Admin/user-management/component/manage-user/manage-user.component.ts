import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { UsersService } from 'src/app/Platform/settings/services/users.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
  loading: boolean = false;
  companyId: any;
  userData: any;
  tableData: any;
  totalRecords: any;
  userId: any;
  cols: any;
  keys: any;
  rowData: any = [];
  baseColoumns = [
    'firstName',
    'email',
    'addressLine1',
    'city'
  ];
  form: FormGroup = new FormGroup({});

  constructor(private userService: UsersService, public notificationService: NotificationService, public router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('currentUser') ? localStorage.getItem('currentUser') : sessionStorage.getItem('currentUser'));
    this.companyId = this.userData.companyId;
    this.form = this.fb.group({
      columns: [this.baseColoumns],
    });
    this.cols = [
      { field: 'firstName', header: 'Name' },
      { field: 'email', header: 'Email' },
      { field: 'addressLine1', header: 'Address' },
      { field: 'city', header: 'City' }
    ]
    this.getUsers();
  }

  getUsers() {
    this.loading = true;
    this.userService.getUser().subscribe(res => {
      if (res.body.data) {
        this.tableData = res.body.data;
        if (!this.keys) {
          this.keys = Object.keys(this.tableData[0]);
          this.keys.sort();
          this.keys.map((res) => {
            this.rowData.push({ label: _.capitalize(res), value: res });
          });
        }
        this.totalRecords = this.tableData.length;
        this.loading = false;
      } else {
        this.loading = false;
      }
    }, err => {
      console.log(err);
      this.notificationService.Error("Something went wrong. Please try again later.")
      this.loading = false;
    })
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
    this.form.value.columns.map((res) => {
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

  showDialog(data: any) {
    this.userId = data.userId;
  }

  deleteUser(userId) {
    this.userService.deleteUser(userId).subscribe(response => {
      if (response.body.status == 200) {
        this.getUsers();
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      console.log('this.error', error);
      this.notificationService.Error(error); 0
    });
  }

  edit(data) {
    this.router.navigate(['/users/add-user'], { queryParams: { userId: data.userId } });
  }

}
