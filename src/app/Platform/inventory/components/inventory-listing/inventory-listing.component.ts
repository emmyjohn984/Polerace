import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-inventory-listing',
  templateUrl: './inventory-listing.component.html',
  styleUrls: ['./inventory-listing.component.scss'],
})
export class InventoryListingComponent implements OnInit {
  userData: any = [];
  companyId: any;
  inventoryId: any;
  data: any;
  id: any;
  inventoryid: any;
  loading: boolean = false;
  cols:any;
  keys: any;
  totalRecords:any;
  rowdata: any = [];
  baseColoumns = [
    'title',
    'sku',
    'sellingPrice',
    'quantity',
    'description',
    'categoryName',
    'supplierName'
  ];
  dataSource: any = [];
  form: FormGroup = new FormGroup({});

  constructor(
    private is: InventoryService,
    private router: Router,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      columns: [this.baseColoumns]
    });
    this.userData = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    this.companyId = this.userData.companyId;
    this.getInventoryList();
    this.cols = [
      { field: 'title', header: 'Product Name' },
      { field: 'sku', header: 'Product Code' },
      { field: 'sellingPrice', header: 'Price' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'description', header: 'Product Description' },
      { field: 'categoryName', header: 'Category name' },
      { field: 'supplierName', header: 'Supplier Name'}
    ]
  }

  getInventoryList() {
    this.loading = true;
    this.is.getInventoryList(this.companyId).subscribe((res) => {
      if(res.body.data){
        this.data = res.body.data;
        this.dataSource = [];
        this.data.map(res=>{this.dataSource.push(res.inventory)});
        if (!this.keys) {
          this.keys = Object.keys(this.dataSource[0]);
          this.keys.sort();
          this.keys.map((res) => {
            this.rowdata.push({ label: _.capitalize(res), value: res });
          });
        }
        this.totalRecords=this.dataSource.length;
        this.loading = false;
      }else{
        this.loading = false;
      }
    },err=>{
      this.notificationService.Error('Something went wrong. Please try again later.')
      this.loading = false;
    });
  }

  edit(inventoryId) {
    this.id = inventoryId;
    this.router.navigate(['/inventory/update-inventory'], {
      queryParams: { inventoryId: inventoryId },
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
    let  columns = [];
    this.cols.map((res) => {
      columns.push(res.field);
    });

    let compare = Array.filter((val) => !columns.includes(val));
    compare.map(res=>{this.baseColoumns.push(res)});

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

  showDialog(id) {
    this.inventoryid = id;
  }

  deleteinventory(id) {
    id = this.inventoryid;
    this.is.deleteinventory(id).subscribe((res) => {
      this.loading=true;
      this.data = res.body.data;
      if (res.body.status == 200 && res.body.data != null) {
        this.loading=false;
        this.notificationService.Success(res.body.message);
        this.getInventoryList();
      }
    });
  }
}
