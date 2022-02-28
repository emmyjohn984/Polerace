import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatSort } from '@angular/material/sort';
import { UsersService } from 'src/app/Platform/settings/services/users.service';
import { InventoryService } from '../../services/inventory.service';
import { PermissionsHelper } from 'src/app/shared/helpers/permissions-helper';
import { Metadata } from 'src/app/shared/models/common';
import { AddFiltersDialogComponent } from 'src/app/Platform/listing/components/add-filters-dialog/add-filters-dialog.component';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.scss']
})
export class ProductListingComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['sku', 'title', 'asin', 'initialCostPrice', 'retailPrice', 'quantity', "actions"];
  dataSource = new MatTableDataSource<any>();
  users: Array<any> = [];
  products: Array<any> = [];
  userData: any = {};
  filterValues = {};
  inventoryFilters: any = [];
  filterSelectObj = [];
  SearchAllTextVal: string = "";
  hasAsin: boolean = true;
  metaData: Metadata = new Metadata();
  pageNumber = 1;
  pageSize = 5;
  customFilters: Array<any> = [];
  defaultFilter: string = '';
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  displayProgressSpinner = false;

  constructor(private router: Router, private userService: UsersService, private notificationService: NotificationService, private dialog: MatDialog,
    private inventoryService: InventoryService, public permissionsHelper: PermissionsHelper) {
    this.getDisplayColumns();
    this.getFilterSelectObj();
    // Overrride default filter behaviour of Material Datatable
    this.dataSource.filterPredicate = this.createFilter();

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
    this.defaultFilter = '';
    this.getProductList();
    this.getFilters();
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
      //   if(filter.modelValue!=undefined)
      //  if(filter.modelValue.length >= 3)
      // {
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


  getFilterSelectObj() {


    // Object to create Filter for
    this.filterSelectObj = [
      {
        name: 'sku',
        columnProp: 'sku',
        options: ['Equals to', 'contains'],

      }, {
        name: 'Title',
        columnProp: 'title',
        options: ['Equals to', 'contains']
      }, {
        name: 'ASIN',
        columnProp: 'asin',
        options: ['Equals to', 'contains']
      }, {
        name: 'Cost Price',
        columnProp: 'initialCostPrice',
        options: ['Equals to', 'contains', 'less than or equal to', 'greater than or equal to']
      }, {
        name: 'Selling Price',
        columnProp: 'retailPrice',
        options: ['Equals to', 'contains', 'less than or equal to', 'greater than or equal to']
      },
      {
        name: 'Quantity',
        columnProp: 'quantity',
        options: ['Equals to', 'contains', 'less than or equal to', 'greater than or equal to']
      }
    ]
  }

  getFilters() {
    this.inventoryService.getFilters(this.userData.companyId).subscribe(response => {
      if (response.body.status == 200) {
        this.customFilters = response.body.data;
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      // this.notificationService.Error("Something went wrong. Please try again later");
    });
  }

  handleFilterChange(event) {
    if (event.value == 'None') {
      this.resetFilters();
    }
    else {
      var filter = this.customFilters.find(d => d.filterId == event.value);
      if (filter) {
        this.inventoryFilters = JSON.parse(filter.filterText);
        this.filterSelectObj.forEach((value, key) => {
          value.modelValue = "";
          value.queryType = undefined;
        });
        this.inventoryFilters.forEach((value, key) => {
          //inventory filters rows= no. of search cols
          this.filterSelectObj.forEach((obj, index) => {
            if (obj.columnProp == value.columnName) {
              obj.modelValue = value.filterValue;
              obj.queryType = value.queryType;
            }
          });
        });
        this.getProductList();
      }
    }
  }

  saveFilters() {
    if (this.inventoryFilters.length > 0) {
      this.inventoryFilters.forEach((value, key) => {
        if (value.filterValue == "") {
          this.inventoryFilters.splice(key, 1);
        }

      });
    }
    if (this.inventoryFilters.length > 0) {
      const dialogRef = this.dialog.open(AddFiltersDialogComponent, {
        width: '500px',
        data: { companyID: this.userData.companyId, filters: this.inventoryFilters, filterId: this.defaultFilter }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.getFilters();
      });
    }
  }



  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('currentUser')?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser'));
    this.getProductList();
    this.getFilters();
  }

  getDisplayColumns() {
    if (this.permissionsHelper.viewOnly('inventory')) {
      this.displayedColumns = ['sku', 'title', 'asin', 'initialCostPrice', 'retailPrice', 'quantity', 'actions'];
    }
  }

  onPageChangeEvent(event) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getProductList();
  }

  //To get products
  getProductList() {
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

    let inventoryFilterPagingVM = {
      inventoryFilters: this.inventoryFilters,
      hasAsin: this.hasAsin,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    }
    this.displayProgressSpinner = true;
    this.inventoryService.getFilterdProducts(inventoryFilterPagingVM).subscribe(response => {
      if (response.body.data !== null) {
        this.displayProgressSpinner = false;
        this.products = response.body.data;
        this.metaData = response.body.meta;
        this.dataSource.data = this.products;
        this.updatePaginator(this.metaData.totalRecords)
      }
      else {
        this.products = [];
        this.metaData = new Metadata()
        this.dataSource.data = this.products;
        this.displayProgressSpinner = false;
      }
    }, error => {
      this.displayProgressSpinner = false;
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


  //Edit
  editProduct(productId) {
    this.router.navigate(['/inventory/addproduct'], { queryParams: { productId: productId } });
  }

  //Delete
  deletetProduct(productId) {
    this.inventoryService.deleteProduct(productId).subscribe(response => {
      if (response.body.status == 200) {
        this.getProductList();
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      console.log('this.error', error);
      this.notificationService.Error(error);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(productId) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '600px',
      data: {
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Ok',
          cancel: 'Cancel'
        }
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deletetProduct(productId);
      }
    });
  }
}

