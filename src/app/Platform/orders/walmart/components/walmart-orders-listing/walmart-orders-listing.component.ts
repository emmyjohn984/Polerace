import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Metadata } from 'src/app/shared/models/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { ListingService } from 'src/app/Platform/listing/services/listing.service';
import { PermissionsHelper } from 'src/app/shared/helpers/permissions-helper';
import { MatDialog } from '@angular/material/dialog';
import { Channels } from 'src/app/shared/enums/channels';
import { AmazonOrdersDatePickersDialogComponent } from 'src/app/Platform/listing/components/amazon-orders-date-pickers-dialog/amazon-orders-date-pickers-dialog.component';
import { WalmartOrdersService } from '../../../services/walmart-orders.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-walmart-orders-listing',
  templateUrl: './walmart-orders-listing.component.html',
  styleUrls: ['./walmart-orders-listing.component.scss']
})

export class WalmartOrdersListingComponent implements AfterViewInit {

  displayedColumns: string[] = ['customerOrderId', 'sku', 'productName', 'firstName','chargeName', 'chargeAmount', 'orderDate', 'orderLineStatus', "actions"];
  dataSource = new MatTableDataSource<any>();
  filterSelectObj = [];
  sub: any;
  marketPlace: any;
  userData: any = {};
  filterValues = {};
  inventoryFilters: any = [];
  SearchAllTextVal: string = "";
  isBlocked: boolean = false;
  accounts: Array<any> = [];
  userMarketplace: any = {};
  pageNumber = 1;
  pageSize = 50;
  metaData: Metadata = new Metadata();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  orders: Array<any> = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private listingService: ListingService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    public permissionsHelper: PermissionsHelper,
    private walmartOrdersService: WalmartOrdersService
  ) {
    this.getDisplayColumns();
    this.getFilterSelectObj();
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('currentUser')?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser'));
    this.getUserMarketplacesRegions();
  }

  syncOrders() {
    const dialogRef = this.dialog.open(AmazonOrdersDatePickersDialogComponent, {
      width: '500px',
      data: { channel: 'Walmart' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Walmart'){
        this.getOrders();
      }
    });
  }

  //getUserMarketplacesRegions
  getUserMarketplacesRegions() {
    this.listingService.getUserMarketplacesRegions(this.userData.companyId, Channels.Walmart).subscribe(response => {
      if (response.body.status == 200) {
        this.accounts = response.body.data;
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error(error.message);
    });
  }

  /* Handle acount change event*/
  handleAccountChange(event) {
    this.userMarketplace = this.accounts.find(x => x.userMarketplaceSiteMapId == event.value);
    this.getOrders();
  }
  //To read query string values
  private readQuery() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        //read query string params
      });
  }

  // Called on Filter change
  filterChange(filter, event) {
    if (filter.columnProp == "orderStatus") {
      filter.queryType = "Equals to";
    }
    if (filter === "All") {

      let inventoryFilter = { companyId: this.userData.companyId, columnName: filter, queryType: 'contains', filterValue: this.SearchAllTextVal };
      this.inventoryFilters.forEach((value, key) => {
        if (value.columnName == "") {
          this.inventoryFilters.splice(0, 1);
        }


        if (value.columnName == "orderStatus") {
          value.queryType = "Equals to";
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
        if (value.columnName == "orderLineStatus") {
          inventoryFilter.queryType = "Equals to";
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
    if (this.permissionsHelper.viewOnly('Orders')) {
      this.displayedColumns = ['customerOrderId', 'sku', 'productName', 'firstName','chargeName', 'chargeAmount', 'orderDate', 'orderLineStatus', 'actions'];
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
        name: 'customerOrderId',
        columnProp: 'customerOrderId',
        options: ['Equals to', 'contains'],

      }, {
        name: 'sku',
        columnProp: 'sku',
        options: ['Equals to', 'contains']
      }, {
        name: 'productName',
        columnProp: 'productName',
        options: ['Equals to', 'contains']
      },
      {
        name: 'firstName',
        columnProp: 'firstName',
        options: ['Equals to', 'contains']
      },
      {
        name: 'chargeName',
        columnProp: 'chargeName',
        options: ['Equals to', 'contains']
      },
       {
        name: 'chargeAmount',
        columnProp: 'chargeAmount',
        options: ['Equals to', 'contains', 'less than or equal to', 'greater than or equal to']
      }, {
        name: 'orderDate',
        columnProp: 'orderDate',
        options: ['Equals to', 'less than or equal to', 'greater than or equal to']
      },
      {
        name: 'orderLineStatus',
        columnProp: 'orderLineStatus',
        options: ['Equals to']
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
    this.getOrders();
  }

  onPageChangeEvent(event) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getOrders();
  }

  getOrders() {
    if (this.userMarketplace == undefined) {
      this.notificationService.Error("Please select a marketplace.");
      return false;

    }
    else {
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
        walmartFilters: this.inventoryFilters,
        UserMarketplaceId: this.userMarketplace.userMarketplaceId,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }

      this.walmartOrdersService.getWalmartFilteredOrders(inventoryFilterPagingVM).subscribe(response => {
        if (response.body.data !== null) {
          this.orders = response.body.data;
          this.metaData = response.body.meta;
          this.dataSource.data = this.orders;
          this.updatePaginator(this.metaData.totalRecords)
        }
        else {
          this.orders = [];
          this.metaData = new Metadata()
          this.dataSource.data = this.orders;
        }
      }, error => {
        this.notificationService.Error("Something went wrong. Please try again later.")
      });
    }
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

  deleteOrder(orderID) {
    this.walmartOrdersService.deleteWalmartOrder(orderID).subscribe(response => {
      if (response.body.status == 200) {
        this.notificationService.Success(response.body.message);
        this.getOrders();
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error(error.message);
    });
  }

  openDialog(orderID) {
    let message = "Are you sure you want delete?"
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
        this.deleteOrder(orderID);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
