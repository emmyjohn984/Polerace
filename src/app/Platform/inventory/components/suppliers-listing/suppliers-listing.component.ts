import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { UsersService } from 'src/app/Platform/settings/services/users.service';
import { InventoryService } from '../../services/inventory.service';
import { PermissionsHelper } from 'src/app/shared/helpers/permissions-helper';
import * as moment from 'moment';
import * as _ from 'lodash';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-suppliers-listing',
  templateUrl: './suppliers-listing.component.html',
  styleUrls: ['./suppliers-listing.component.scss'],
})
export class SuppliersListingComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'createdDate',
    'isActive',
  ];
  users: Array<any> = [];
  suppliers: Array<any> = [];
  userData: any = {};
  loading: boolean = false;
  dataSource: any;
  deleteId: number;
  cols: any;
  keys: any;
  rowData: any = [];
  baseColoumns = [
    'firstName',
    'lastName',
    'createdDate',
    'isActive'
  ];
  form: FormGroup = new FormGroup({});

  constructor(
    private router: Router,
    private userService: UsersService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private inventoryService: InventoryService,
    public permissionsHelper: PermissionsHelper,
    private fb: FormBuilder
  ) {
    this.getDisplayColumns();
  }

  ngOnInit() {
    this.form = this.fb.group({
      columns: [this.baseColoumns]
    });
    this.userData = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    this.cols = [
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'Last Name' },
      { field: 'isActive', header: 'Status' },
      { field: 'createdDate', header: 'Created Date' }
    ];

    this.getSuppliersList();
  }

  getDisplayColumns() {
    if (this.permissionsHelper.viewOnly('inventory')) {
      this.displayedColumns = [
        'firstName',
        'lastName',
        'createdDate',
        'isActive'
      ];
    }
  }

  //To get products
  getSuppliersList() {
    this.loading = true;
    this.inventoryService.getSuppliers(this.userData.companyId).subscribe(
      (response) => {
        if (response.body.data !== null) {
          this.suppliers = response.body.data;
          this.dataSource = this.suppliers;
          this.hideloader();
          if (!this.keys) {
            this.keys = Object.keys(this.dataSource[0]);
            this.keys.sort();
            this.keys.map((res) => {
              this.rowData.push({ label: _.capitalize(res), value: res });
            });
          }
          this.suppliers.map((data: any) => {
            let suppliers = data;
            if (data.isActive == true) {
              data.isActive = 'Active';
            } else {
              data.isActive = 'InActive';
            }
          });
        } else {
          this.hideloader()
          console.log('this.message', response.body.message);
        }
      },
      (error) => {
        this.hideloader();
        this.notificationService.Error(error.message);
        console.log('this.error', error);
      }
    );
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

  hideloader() {
    this.loading = false;
  }

  //Edit
  editSupplier(supplierId) {
    this.router.navigate(['/inventory/addsupplier'], {
      queryParams: { supplierId: supplierId },
    });
  }

  //Delete
  deleteSupplier(supplierId) {
    this.inventoryService.deleteSupplier(supplierId).subscribe(
      (response) => {
        if (response.body.status == 200) {
          this.notificationService.Success('Supplier Deleted Successfully.');
          this.getSuppliersList();
        } else {
          this.notificationService.Error(response.body.message);
        }
      },
      (error) => {
        console.log('this.error', error);
        this.notificationService.Error(error.message);
      }
    );
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  showId(supplierId: number) {
    this.deleteId = supplierId;
  }
}
