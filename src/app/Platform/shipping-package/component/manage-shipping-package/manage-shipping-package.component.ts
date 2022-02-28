import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ShippingPackageService } from '../../service/shipping-package.service';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-manage-shipping-package',
  templateUrl: './manage-shipping-package.component.html',
  styleUrls: ['./manage-shipping-package.component.scss'],
})
export class ManageShippingPackageComponent implements OnInit {
  loading: boolean = false;
  userData: any;
  totalRecords: number = 0;
  pageNumber: number = 1;
  first = 0;
  last = 0;
  pageSize: number = 10;
  order = 'asc';
  isActive = true;
  Direction: any;
  orderBy: any = [
    {
      orderBy: 'asc',
      name: 'ascending',
    },
    {
      orderBy: 'desc',
      name: 'descending',
    },
  ];
  orderDirection: any = 'ShippingPackageId';
  search: any = null;
  tableData: any;
  companyId: any;
  shippingPackage: any;
  cols: any;
  keys: any;
  rowData: any = [];
  baseColoumns = [
    'shippingPackageName',
    'supplierName',
    'totalPrice',
    'quantity',
    'isActive',
  ];
  form: FormGroup = new FormGroup({});

  constructor(
    private shippingService: ShippingPackageService,
    private router: Router,
    public toastrService: ToastrService,private fb: FormBuilder
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
      { field: 'shippingPackageName', header: 'Shipping Package Name' },
      { field: 'supplierName', header: 'Supplier Name' },
      { field: 'totalPrice', header: 'Total Price' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'isActive', header: 'Status' }
    ]
    this.companyId = this.userData.companyId;
    this.getPackages();
  }

  getPackages() {
    this.loading = true;
    let param = {
      companyId: this.companyId,
      pageNumber: this.pageNumber,
      isActive: this.isActive,
      pageSize: this.pageSize,
      orderDirection: this.Direction == undefined ? this.order : this.Direction,
      orderBy: this.orderDirection,
      search: this.search,
    };
    this.shippingService.getShippingList(param).subscribe((res) => {
      if (res.body.data) {
        this.tableData = res.body.data;
        if (!this.keys) {
          this.keys = Object.keys(this.tableData[0]);
          this.keys.sort();
          this.keys.map((res) => {
            this.rowData.push({ label: _.capitalize(res), value: res });
          });
        }
        this.totalRecords = res.body.meta.totalRecords;
        this.loading = false;
      } else {
        this.loading = false;
      }
    },err=>{
      this.loading = false;
    });
  }

  setPagination(e) {
    if (e.sortField == 'title') {
      this.orderDirection = 'Productname';
    }
    if (e.sortField == 'sku') {
      this.orderDirection = 'supplierName';
    }
    if (e.sortField == 'sellingPrice') {
      this.orderDirection = 'price';
    }
    if (e.sortField == 'quantity') {
      this.orderDirection = 'quantity';
    }
    this.loading = true;
    this.search = e.globalFilter != '' ? e.globalFilter : null;
    this.pageNumber = e.first / e.rows + 1;
    this.pageSize = e.rows;
    this.orderBy = e.sortField == undefined ? 'orderId' : e.sortField;
    this.Direction = e.sortOrder == 1 ? 'asc' : 'desc';
    this.getPackages();
  }

  addShipping() {
    this.router.navigate([`shipping-package/add-package`]);
  }

  showDialog(e) {
    this.shippingPackage = e;
  }

  edit(data) {
    this.router.navigate([
      `shipping-package/edit-package/${data.shippingPackageId}`,
    ]);
  }

  getData(value: any) {
    var formats = [
      moment.ISO_8601,
      "MM/DD/YYYY  :)  HH*mm*ss"
    ];
    let array = [];
    for (let i = 0; i < this.cols.length; i++) {
      if (!moment(value[this.cols[i].field], formats, true).isValid() || typeof value[this.cols[i].field] === 'number') {
        if (this.cols[i].field == 'isActive') {
          if (!!value[this.cols[i].field]) {
            array.push('Active');
          } else {
            array.push('In-Active');
          }
        } else {
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

  deletePackage() {
    this.loading = true;
    let packageId = this.shippingPackage.shippingPackageId;
    this.shippingService.deletePackage(packageId).subscribe((res) => {
      this.toastrService.success('Shipping Package deleted');
      this.getPackages();
    });
  }
}
