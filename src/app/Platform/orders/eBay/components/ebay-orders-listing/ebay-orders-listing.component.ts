import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { PermissionsHelper } from 'src/app/shared/helpers/permissions-helper';
import { Channels } from 'src/app/shared/enums/channels';
import { Metadata } from 'src/app/shared/models/common';
import { ListingService } from 'src/app/Platform/listing/services/listing.service';
import { eBayOrdersService } from '../../../services/ebay.orders.service';

@Component({
  selector: 'app-ebay-orders-listing',
  templateUrl: './ebay-orders-listing.component.html',
  styleUrls: ['./ebay-orders-listing.component.scss']
})

export class EbayOrdersListingComponent implements AfterViewInit {

  displayedColumns: string[] = ['orderId', 'Sku','title', 'buyerUserName', 'totalAmount', 'OrderCreationDate', 'orderStatus', "actions"];
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
    private ebayOrdersService: eBayOrdersService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    public permissionsHelper: PermissionsHelper) {
    this.getDisplayColumns();
    this.getFilterSelectObj();
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('currentUser')?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser'));
    this.getUserMarketplacesRegions();
  }



  //getUserMarketplacesRegions
  getUserMarketplacesRegions() {
    this.listingService.getUserMarketplacesRegions(this.userData.companyId, Channels.eBay).subscribe(response => {
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
    this.geteBayOrders();
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
        if (value.columnName == "orderStatus") {
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
      this.displayedColumns = ['orderId', 'Sku',,'title', 'buyerUserName', 'totalAmount', 'OrderCreationDate', 'orderStatus', 'actions'];
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
        name: 'orderId',
        columnProp: 'orderId',
        options: ['Equals to', 'contains'],

      }, {
        name: 'sku',
        columnProp: 'sku',
        options: ['Equals to', 'contains']
      }, {
        name: 'title',
        columnProp: 'title',
        options: ['Equals to', 'contains']
      },
      {
        name: 'buyerUserName',
        columnProp: 'buyerUserName',
        options: ['Equals to', 'contains']
      }, {
        name: 'totalAmount',
        columnProp: 'totalAmount',
        options: ['Equals to', 'contains', 'less than or equal to', 'greater than or equal to']
      }, {
        name: 'orderCreationDate',
        columnProp: 'orderCreationDate',
        options: ['Equals to', 'less than or equal to', 'greater than or equal to']
      },
      {
        name: 'orderStatus',
        columnProp: 'orderStatus',
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
    this.geteBayOrders();
  }

  onPageChangeEvent(event) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.geteBayOrders();
  }

  geteBayOrders() {
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
        eBayFilters: this.inventoryFilters,
        UserMarketplaceId: this.userMarketplace.userMarketplaceId,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }

      this.ebayOrdersService.geteBayFilteredOrders(inventoryFilterPagingVM).subscribe(response => {
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

  deleteeBayOrder(orderID) {
    this.ebayOrdersService.deleteeBayOrder(orderID).subscribe(response => {
      if (response.body.status == 200) {
        this.notificationService.Success(response.body.message);
        this.geteBayOrders();
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
        this.deleteeBayOrder(orderID);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
