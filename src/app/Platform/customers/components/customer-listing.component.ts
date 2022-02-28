import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../settings/services/users.service';
import { SellersService } from '../../sellers/services/sellers.service';
import { CustomerService } from '../services/customer.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { PermissionsHelper } from 'src/app/shared/helpers/permissions-helper';
import { Metadata } from 'src/app/shared/models/common';


@Component({
  selector: 'app-customer',
  templateUrl: './customer-listing.component.html',
  styleUrls: ['./customer-listing.component.scss']
})
export class CustomerListingComponent implements AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'Phone', 'taxNumber', 'IsBlocked', "actions"];
  dataSource = new MatTableDataSource<any>();
  filterSelectObj = [];
  sub: any;
  marketPlace : string = "";
  userData: any = {};
  filterValues = {};
  inventoryFilters: any = [];
  SearchAllTextVal: string = "";
  isBlocked: boolean = false;
  pageNumber = 1;
  pageSize = 50;
  sellers: any;
  metaData: Metadata = new Metadata();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UsersService,
    private sellerService: SellersService, private customerService: CustomerService,
    private notificationService: NotificationService, private dialog: MatDialog, public permissionsHelper: PermissionsHelper) {
    this.userData = JSON.parse(localStorage.getItem('currentUser')?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser'));
    this.getDisplayColumns();
    this.getFilterSelectObj();
    this.dataSource.filterPredicate = this.createFilter();
  }
  ngOnInit() {
    this.readQuery();
    this.getCustomers();
  }

  //To read query string values
  private readQuery() {

    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.marketPlace = params['marketPlace'];
      if(this.marketPlace==undefined){
        this.marketPlace =""
      }
      });


  }
  // Called on Filter change
  filterChange(filter, event) {
    if (filter === "All") {
      //  if(this.SearchAllTextVal!=""){
      let inventoryFilter = { companyId: this.userData.companyId, columnName: filter, queryType: 'contains', filterValue: this.SearchAllTextVal };
      this.inventoryFilters.forEach((value, key) => {
        if (value.columnName == "") {
          this.inventoryFilters.splice(0, 1);
        }
        if (value.columnName == inventoryFilter.columnName) {
          value.queryType = inventoryFilter.queryType;
          value.filterValue = inventoryFilter.filterValue;
        }
        else {
          let data = this.inventoryFilters.find(ob => ob.columnName === inventoryFilter.columnName);
          if (data === undefined) {
            this.inventoryFilters.push(inventoryFilter);
          }
        }
      });

    }
    else {
      if (filter.queryType == undefined) {
        filter.queryType = "contains";
      }

      let inventoryFilter = { companyId: this.userData.companyId, columnName: filter.columnProp, queryType: filter.queryType, filterValue: filter.modelValue };

      this.inventoryFilters.forEach((value, key) => {
        if (value.columnName == "") {
          this.inventoryFilters.splice(0, 1);
        }
        if (value.columnName == inventoryFilter.columnName) {
          value.queryType = inventoryFilter.queryType;
          value.filterValue = inventoryFilter.filterValue;
        }
        else {
          let data = this.inventoryFilters.find(ob => ob.columnName === inventoryFilter.columnName);
          if (data === undefined) {
            this.inventoryFilters.push(inventoryFilter);
          }
        }
      });
    }

  }


  // Custom filter method fot Angular Material Datatable
  createFilter() {
    let filterFunction = function (data: any, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      let isFilterSet = false;
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
        }
      }
      let nameSearch = () => {
        let found = false;
        if (isFilterSet) {
          for (const col in searchTerms) {
            searchTerms[col].trim().toLowerCase().split(' ').forEach(word => {
              if (data[col].toString().toLowerCase().indexOf(word) != -1 && isFilterSet) {
                found = true
              }
            });
          }
          return found
        } else {
          return true;
        }
      }
      return nameSearch()
    }
    return filterFunction
  }

  getDisplayColumns() {
    if (this.permissionsHelper.viewOnly('Customers')) {
      this.displayedColumns = ['firstName', 'lastName', 'email', 'Phone', 'taxNumber', 'IsBlocked','actions'];
    }
  }

  // Get Uniqu values from columns to build filter
  getFilterObject(fullObj, key) {
    const uniqChk = [];
    fullObj.filter((obj) => {
      if (!uniqChk.includes(obj[key])) {
        uniqChk.push(obj[key]);
      }
      return obj;
    });
    return uniqChk;
  }
  getFilterSelectObj() {


    // Object to create Filter for
    this.filterSelectObj = [
      {
        name: 'FirstName',
        columnProp: 'firstname',
        options: ['Equals to', 'contains'],

      }, {
        name: 'LastName',
        columnProp: 'lastname',
        options: ['Equals to', 'contains']
      }, {
        name: 'Email',
        columnProp: 'email',
        options: ['Equals to', 'contains']
      }, {
        name: 'Phone',
        columnProp: 'phone',
        options: ['Equals to', 'contains', 'less than or equal to', 'greater than or equal to']
      }, {
        name: 'Tax Number',
        columnProp: 'taxNumber',
        options: ['Equals to', 'contains', 'less than or equal to', 'greater than or equal to']
      },
      {
        name: 'blocked',
        columnProp: 'isBlocked',
        options: ['Equals to', 'contains', 'less than or equal to', 'greater than or equal to']
      }
    ]
  }

  // Reset table filters
  resetFilters() {
    this.filterValues = {}
    this.filterSelectObj.forEach((value, key) => {
      value.modelValue = "";
      value.queryType = undefined;
    });
    this.SearchAllTextVal = "";
    this.inventoryFilters = [];
    this.isBlocked = false;
    this.getCustomers();
  }

  onPageChangeEvent(event) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getCustomers();
  }

  getCustomers() {

    if (this.inventoryFilters.length > 0) {

      this.inventoryFilters.forEach((value, key) => {
        if (value.filterValue == "") {
          this.inventoryFilters.splice(key, 1);
        }
      });
    }
    if (this.inventoryFilters.length == 0) {
      this.inventoryFilters = [{ companyId: this.userData.companyId, columnName: "", queryType: "", filterValue: "" }];
    }
    var inventoryFilterPagingVM = {
      customerFilters: this.inventoryFilters,
      userMarketPlace: this.marketPlace,
      showBlocked: this.isBlocked,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    }

    this.customerService.getFilteredCustomers(inventoryFilterPagingVM).subscribe(response => {
      if (response.body.data !== null) {
        this.sellers = response.body.data;
        this.dataSource.data = this.sellers;
        this.metaData = response.body.meta;
        this.updatePaginator(this.metaData.totalRecords);

      }
      else {
        this.sellers = [];
        this.metaData = new Metadata()
        this.dataSource.data = this.sellers;
      }

    }, error => {
      this.notificationService.Error("Something went wrong. Please try again later.")
    });

  }

  updatePaginator(filteredDataLength: number) {
    Promise.resolve().then(() => {
      if (!this.paginator) { return; }
      this.paginator.length = filteredDataLength;
      // If the page index is set beyond the page, reduce it to the last page.
      if (this.paginator.pageIndex > 0) {
        const lastPageIndex = Math.ceil(this.paginator.length / this.paginator.pageSize) - 1 || 0;
        this.paginator.pageIndex = Math.min(this.paginator.pageIndex, lastPageIndex);
      }
    });
  }

  editUser(userId) {
    this.router.navigate(['/customers/addCustomer'], { queryParams: { customerId: userId, marketplace: this.marketPlace } });
  }

  deleteUser(userId, value) {
    let val = value ? 1 : 0;
    this.customerService.blockUnblockCustomer(userId, val).subscribe(response => {
      if (response.body.status == 200) {
        this.notificationService.Success(response.body.message);
        this.getCustomers();
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error(error);
    });
  }

  openDialog(userId, value) {
    let message = "";
    if (value) {
      message = "Are you sure you want unblock this customer?"
    }
    else {
      message = "Are you sure you want block this customer?"
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '600px',
      data: {
        message: message,
        buttonText: {
          ok: 'Ok',
          cancel: 'Cancel'
        }
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteUser(userId, value);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
