import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import* as moment from 'moment'
import { InventoryService } from '../../inventory/services/inventory.service';
import * as _ from 'lodash';
import { OrderService } from '../services/order.service';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-order-listing',
  templateUrl: './order-listing.component.html',
  styleUrls: ['./order-listing.component.scss'],
})
export class OrderListingComponent implements OnInit {
  suppliers: any;
  deleteId: number;
  dataSource: any;
  loading: boolean = false;
  productlist: any;
  userData: any;
  filterOn: boolean = false;
  firstName: any = '';
  supId: number = 0;
  supplierName: any;
  orders: any;
  cols: any;
  keys: any;
  rowData: any = [];
  baseColoumns = [
    'title',
    'shippingPackageName',
    'tracking_Number',
    'grandTotal',
    'quantity',
    'fulfillment_Status',
  ];
  form: FormGroup = new FormGroup({});

  constructor(
    private inventoryService: InventoryService,
    private notificationService: NotificationService,
    private router: Router,
    private orderService: OrderService, private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userData = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    this.form = this.fb.group({
      columns: [this.baseColoumns],
    });
    this.cols = [
      { field: 'title', header: 'Product Name' },
      { field: 'shippingPackageName', header: 'Shipping Package Name' },
      { field: 'tracking_Number', header: 'Tracking Number' },
      { field: 'grandTotal', header: 'Price' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'fulfillment_Status', header: 'Order Status' }
    ];
    this.getOrders();
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

  getOrders() {
    this.loading = true;
    this.orderService
      .getPurchaseOrder(this.userData.companyId)
      .subscribe((res) => {
        if (res.body.data) {
          this.orders = res.body.data;
          this.dataSource = res.body.data;
          if (!this.keys) {
            this.keys = Object.keys(this.dataSource[0]);
            this.keys.sort();
            this.keys.map((res) => {
              this.rowData.push({ label: _.capitalize(res), value: res });
            });
          }
          this.loading = false;
        }else{
          this.loading = false;
        }
      },error =>{
        this.loading=false;
      });
  }

  //To get products
  getSuppliersList() {
    this.loading = true;
    this.inventoryService.getSuppliers(this.userData.companyId).subscribe(
      (response) => {
        if (response.body.data !== null) {
          this.suppliers = response.body.data;
          this.loading = false;
          response.body.data.map((data) => { });
          this.supplierName =
            response.body.data[0].firstName.toString() +
            response.body.data[0].lastName.toString();
        } else {
          this.notificationService.Info(response.body.message);
          this.loading = false;
        }
      },
      (error) => {
        this.loading = false;
        this.notificationService.Error(error);
      }
    );
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

  edit(orderID) {
    this.router.navigate(['/orders/add-order'], {
      queryParams: { orderID: orderID },
    });
  }

  deleteOrder(orderID: number) {
    this.loading = true;
    this.orderService.deleteOrderById(orderID).subscribe(
      (response) => {
        if (response.body.status == 200 && response.body.data != null) {
          this.notificationService.Success('order deleted successfully');
          this.getOrders();
          this.loading = false;
        } else {
          this.notificationService.Error(response.body.message);
          this.loading = false;
        }
      },
      (error) => {
        this.loading = false;
        this.notificationService.Error(
          'Something went wrong. Please try again later.'
        );
      }
    );
  }

  onSupplierChange(event) {
    this.loading = true;
    let comp = this.userData.companyId;
    this.inventoryService.getPurchaseOrderHIstory(comp, event).subscribe(
      (res) => {
        this.productlist = res.body.data;
        this.dataSource = this.productlist;
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
        this.notificationService.Error(
          'Something went wrong. Please try again later.'
        );
      }
    );
  }

  showId(orderId: number) {
    this.deleteId = orderId;
  }

}
