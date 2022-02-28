import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../settings/services/users.service';
import { ListingService } from '../../../listing/services/listing.service';
import { SellersService } from '../../../sellers/services/sellers.service';
import { AmazonOrdersService } from '../../services/amazon.orders.services';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { PermissionsHelper } from 'src/app/shared/helpers/permissions-helper';
import { Channels } from 'src/app/shared/enums/channels';
import { AmazonOrdersDatePickersDialogComponent } from '../../../listing/components/amazon-orders-date-pickers-dialog/amazon-orders-date-pickers-dialog.component';
import { Metadata } from 'src/app/shared/models/common';

@Component({
  selector: 'app-amazonOrders',
  templateUrl: './amazon-orders-listing.component.html',
  styleUrls: ['./amazon-orders-listing.component.scss']
})

export class AmazonOrdersListingComponent implements AfterViewInit {

  displayedColumns: string[] = ['amazonOrderId', 'orderType', 'buyerName', 'orderTotalAmount', 'purchaseDate', 'orderStatus', "actions"];
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
  sellers: any;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UsersService,
    private listingService: ListingService,
    private sellerService: SellersService, private amazonOrdersService: AmazonOrdersService,
    private notificationService: NotificationService, private dialog: MatDialog, public permissionsHelper: PermissionsHelper) {
    this.userData = JSON.parse(localStorage.getItem('currentUser')?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser'));
    this.getDisplayColumns();
    this.getFilterSelectObj();
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngOnInit() {
    this.getUserMarketplacesRegions();
  }



  //getUserMarketplacesRegions
  getUserMarketplacesRegions() {
    this.listingService.getUserMarketplacesRegions(this.userData.companyId, Channels.Amazon).subscribe(response => {
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
    this.getAmazonOrders();
  }
  //To read query string values
  private readQuery() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        //this.marketPlace = 'amazon';
      });
  }
  // Called on Filter change
  // Called on Filter change
  filterChange(filter, event) {
    if (filter.columnProp == "orderStatus") {
      filter.queryType = "Equals to";
    }
    if (filter === "All") {
      //  if(this.SearchAllTextVal!=""){
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
      //   if(filter.modelValue!=undefined)
      //  if(filter.modelValue.length >= 3)
      // {
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
    // this.getProductList();
    //}
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
      this.displayedColumns = ['amazonOrderId', 'orderType', 'buyerName', 'orderTotalAmount', 'purchaseDate', 'orderStatus','actions'];
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
        name: 'amazonOrderId',
        columnProp: 'amazonOrderId',
        options: ['Equals to', 'contains'],

      }, {
        name: 'orderType',
        columnProp: 'orderType',
        options: ['Equals to', 'contains']
      }, {
        name: 'buyerName',
        columnProp: 'buyerName',
        options: ['Equals to', 'contains']
      }, {
        name: 'orderTotalAmount',
        columnProp: 'orderTotal_Amount',
        options: ['Equals to', 'contains', 'less than or equal to', 'greater than or equal to']
      }, {
        name: 'purchaseDate',
        columnProp: 'purchaseDate',
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
    this.getAmazonOrders();
  }

  onPageChangeEvent(event) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getAmazonOrders();
  }

  getAmazonOrders() {
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
        amazonFilters: this.inventoryFilters,
        UserMarketplaceId: this.userMarketplace.userMarketplaceId,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }

      this.amazonOrdersService.getFilteredAmazonOrders(inventoryFilterPagingVM).subscribe(response => {
        if (response.body.data !== null) {
          this.sellers = response.body.data;
          this.metaData = response.body.meta;
          this.dataSource.data = this.sellers;
          this.updatePaginator(this.metaData.totalRecords)
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

  editUser(amazonorderId) {
    this.router.navigate(['/orders/amazonOrder'], { queryParams: { amazonOrderId: amazonorderId, marketplace: this.marketPlace } });
  }

  deleteAmazonOrder(id) {
    this.amazonOrdersService.deleteAmazonOrder(id).subscribe(response => {
      if (response.body.status == 200) {
        this.notificationService.Success(response.body.message);
        this.getAmazonOrders();
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error(error.message);
    });
  }

  openDialog(id) {
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
        this.deleteAmazonOrder(id);
      }
    });
  }

  syncOrders() {
    const dialogRef = this.dialog.open(AmazonOrdersDatePickersDialogComponent, {
      width: '500px',
      data: { channel: 'Amazon'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Amazon'){
        this.getAmazonOrders();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
