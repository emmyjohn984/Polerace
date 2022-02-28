import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { TransactionServiceService } from '../../services/transaction-service.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-subscription-history',
  templateUrl: './subscription-history.component.html',
  styleUrls: ['./subscription-history.component.scss']
})
export class SubscriptionHistoryComponent implements OnInit {

  userData:any;
  companyId:number;
  pageNumber:number=1;
  pageSize:number=10;
  orderBy: any = "createdDate";
  OrderDirection: any = 'desc';
  Search: string = null;
  loading:boolean = false;
  filterOn
  dataSource:any;
  totalRecords:any;
  cols: any;
  keys: any;
  rowData: any = [];
  baseColoumns = [
    'userName',
    'subscriptionTitle',
    'subscriptionStart',
    'validity',
    'subscriptionEnd',
  ];
  form: FormGroup = new FormGroup({});

  constructor(private transactionService:TransactionServiceService,private notificationService:NotificationService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.userData = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : JSON.parse(sessionStorage.getItem('currentUser'));
    this.companyId = this.userData.companyId;
    this.form = this.fb.group({
      columns: [this.baseColoumns],
    });
    this.cols = [
      { field: 'userName', header: 'Name'},
      { field: 'subscriptionTitle', header: 'Subscription Name' },
      { field: 'subscriptionStart', header: 'Subscription Start' },
      { field: 'validity', header: 'Validity' },
      { field: 'subscriptionEnd', header: 'Subscription End' },
    ];
    this.getSubscriptionHistory()
  }

  getSubscriptionHistory(){
    this.loading=true;
    let param = {PageNumber:this.pageNumber,PageSize:this.pageSize,OrderBy:this.orderBy,OrderDirection:this.OrderDirection,Search:this.Search}
    this.transactionService.getSubscriptionHistory(param).subscribe(res=>{
      if(res.body.data){
        this.loading=false;
        this.dataSource=res.body.data;
        if (!this.keys) {
          this.keys = Object.keys(this.dataSource[0]);
          this.keys.sort();
          this.keys.map((res) => {
            this.rowData.push({ label: _.capitalize(res), value: res });
          });
        }
        this.totalRecords=res.body.data.length;
      }else{
        this.loading=false;
      }
    },
    err=>{
      this.loading=false;
      this.notificationService.Error("Something went wrong. Please try again later.")
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
    console.log('columns', columns);
    let compare = Array.filter((val) => !columns.includes(val));
    console.log('compare', compare);

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

  setPagination(e){
    this.orderBy = e.sortField == undefined ? 'userId' : e.sortField;
    this.OrderDirection = e.sortOrder == 1 ? 'asc' : 'desc';
    this.Search = e.globalFilter;
    this.pageNumber = (e.first / e.rows) + 1;
    this.pageSize = e.rows;
    this.getSubscriptionHistory();
  }

  edit(data){

  }

  showDialog(data){

  }

  filterReset(){

  }

  view(orderId,globalMarketplaceI){

  }

  deletePackage(){

  }

}
