import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { InventoryService } from '../../services/inventory.service';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-productorderlistbysupplier',
  templateUrl: './productorderlistbysupplier.component.html',
  styleUrls: ['./productorderlistbysupplier.component.scss']
})
export class ProductorderlistbysupplierComponent implements OnInit {
  loading: boolean = false;
  filter: boolean = false;
  suppliers: any;
  userData: any;
  products: any;
  dataSource: any = [];
  productlist: any;
  firstName: any = '';
  supId: number = 0;
  cols: any;
  keys: any;
  rowData: any = [];
  baseColoumns = [
    'title',
    'sku',
    'sellingPrice',
    'quantity',
    'description',
  ];
  form: FormGroup = new FormGroup({});

  constructor(private inventoryService: InventoryService,private fb: FormBuilder, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      columns: [this.baseColoumns]
    });
    this.userData = JSON.parse(localStorage.getItem('currentUser') ? localStorage.getItem('currentUser') : sessionStorage.getItem('currentUser'));
    this.cols = [
      { field: 'title', header: 'Product Name' },
      { field: 'sku', header: 'Product Code' },
      { field: 'sellingPrice', header: 'Price' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'description', header: 'Description'}
    ];
    this.getSuppliersList();
    this.onSupplierChange(this.supId);
  }

  //To get products
  getSuppliersList() {
    this.inventoryService.getSuppliers(this.userData.companyId).subscribe(response => {
      if (response.body.data) {
        this.suppliers = response.body.data;
      }else{
        this.loading = false;
      }
    }, error => {
      this.loading=false;
      this.notificationService.Error(error);
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

  onSupplierChange(event) {
    this.loading = true;
    this.inventoryService.getProductListBySuplier(this.userData.companyId, event).subscribe(res => {
      if (res.body.data) {
        this.dataSource = res.body.data;
        this.products = res.body.data;
        this.loading = false;
        if (!this.keys) {
          this.keys = Object.keys(this.dataSource[0]);
          this.keys.sort();
          this.keys.map((res) => {
            this.rowData.push({ label: _.capitalize(res), value: res });
          });
        }
      } else {
        this.loading = false;
        this.notificationService.Info(res.body.message);
      }
    }, error => {
      this.loading = false;
      this.notificationService.Error('Something went wrong. Please try again later.');
    });
  }


  filterReset() {
    this.firstName = '';
    this.getSuppliersList();
    this.onSupplierChange(this.supId);
  }

}
