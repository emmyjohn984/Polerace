import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { UsersService } from '../../../settings/services/users.service';
import {  SellersService } from '../../services/sellers.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-manage-sellers',
  templateUrl: './manage-sellers.component.html',
  styleUrls: ['./manage-sellers.component.scss']
})
export class ManageSellersComponent implements AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'Company Name', 'createdDate', 'isActive', "actions"];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  sellers:any;
  deleteId:number;
  loading:boolean = false;
  compId:number;
  deletedId:number;
  tableData:any;
  cols: any;
  keys: any;
  rowData: any = [];
  selectedColoumns: any[];
  baseColoumns = [
    'firstName',
    'lastName',
    'email',
    'createdDate',
    'isActive',
  ];
  constructor(private router: Router, private userService: UsersService,
    private sellerService:SellersService,
     private notificationService: NotificationService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.cols = [
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'Last Name' },
      { field: 'email', header: 'Email' },
      { field: 'createdDate', header: 'Created Date' },
      { field: 'isActive', header: 'Status' }
    ]
    this.getSellers();
  }

  getSellers(){   
    let userData = JSON.parse(localStorage.getItem('currentUser')?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser'));
    this.compId=userData.companyId;
    this.loading=true;
    this.sellerService.getSellersForCompanyId(userData.companyId).subscribe(response=>{
      if (response.body.data !== null) {
        this.sellers = response.body.data;
        this.dataSource = this.sellers;
        this.tableData = this.dataSource;
        if (!this.keys) {
          this.keys = Object.keys(this.dataSource[0]);
          this.keys.sort();
          this.baseColoumns.map((res) => {
            if (this.keys.includes(res)) {
              if (this.keys.indexOf(res) > -1) {
                this.keys.splice(this.keys.indexOf(res), 1);
              }
            }
          });
          this.keys.map((res) => {
            this.rowData.push({ label: _.capitalize(res), value: res });
          });
        }
        this.loading=false;
      }
      else {
        this.loading=false;
      }
    },error=>{
      this.notificationService.Error("Something went wrong. Please try again later.")
      this.loading=false;
    });
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

  addColoumns(e?) {
    let Array = [];
    this.selectedColoumns.map((res) => {
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
    compare.map((res) => {
      this.baseColoumns.push(res);
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

  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne.id === objTwo.id;
    }
  }

  editSeller(sellerId) {
    this.router.navigate(['/sellers/addseller'], { queryParams: {sellerId: sellerId} });
  }

  showId(sellerId){
    this.deleteId=sellerId;
  }

  deleteSeller(sellerId) {
    this.sellerService.deleteseller(sellerId).subscribe(response => {
      if (response.body.status == 200) {
        this.notificationService.Success(response.body.message);
        this.getSellers();
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      console.log('this.error', error);
      this.notificationService.Error("Something went wrong. Please try again later.");
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}

export interface PeriodicElement {
  name: string;
  email: string;
  selectrole: string;
  joindate: string;
  active: string;
  locked: string;
  edit: string;
  delete:string;
}






