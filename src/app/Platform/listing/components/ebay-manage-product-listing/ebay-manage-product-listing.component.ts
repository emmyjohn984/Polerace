import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { PermissionsHelper } from 'src/app/shared/helpers/permissions-helper';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { InventoryService } from 'src/app/Platform/inventory/services/inventory.service';
import { ListingService } from '../../services/listing.service';
import { Channels } from 'src/app/shared/enums/channels';
import { EbayCategorySpecificationsDialogComponent } from '../ebay-category-specifications-dialog/ebay-category-specifications-dialog.component';
import { EbayPresetsDialogueComponent } from '../ebay-presets-dialogue/ebay-presets-dialgue.component';
import { Metadata } from 'src/app/shared/models/common';
import { MatSort } from '@angular/material/sort';
import { AddFiltersDialogComponent } from '../add-filters-dialog/add-filters-dialog.component';

@Component({
  selector: 'app-ebay-manage-product-listing',
  templateUrl: './ebay-manage-product-listing.component.html',
  styleUrls: ['./ebay-manage-product-listing.component.scss'],
})
export class EbayManageProductListingComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'select',
    'sku',
    'title',
    'asin',
    'initialCostPrice',
    'retailPrice',
    'quantity',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>();
  products: Array<any> = [];
  userData: any = {};
  filterValues = {};
  inventoryFilters: any = [];
  filterSelectObj = [];
  selection = new SelectionModel<any>(true, []);
  accounts: Array<any> = [];
  userMarketplace: any = {};
  presetModel: any = '';
  SearchAllTextVal: string = '';
  hasAsin: boolean = true;
  ebayPresets: Array<any> = [];
  selectedRows: Array<any> = [];
  metaData: Metadata = new Metadata();
  pageNumber = 1;
  pageSize = 5;
  customFilters: Array<any> = [];
  defaultFilter: string = '';

  constructor(
    private router: Router,
    private listingService: ListingService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private inventoryService: InventoryService,
    public permissionsHelper: PermissionsHelper
  ) {
    this.getDisplayColumns();
    this.getFilterSelectObj();
    // Overrride default filter behaviour of Material Datatable
    this.dataSource.filterPredicate = this.createFilter();
  }

  getFilters() {
    this.listingService.getFilters(this.userData.companyId).subscribe(
      (response) => {
        if (response.body.status == 200) {
          this.customFilters = response.body.data;
        } else {
          this.notificationService.Error(response.body.message);
        }
      },
      (error) => {
        this.notificationService.Error(error.message);
      }
    );
  }

  handleFilterChange(event) {
    if (event.value == 'None') {
      this.resetFilters();
    } else {
      var filter = this.customFilters.find((d) => d.filterId == event.value);
      if (filter) {
        this.inventoryFilters = JSON.parse(filter.filterText);
        this.filterSelectObj.forEach((value, key) => {
          value.modelValue = '';
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
        if (value.filterValue == '') {
          this.inventoryFilters.splice(key, 1);
        }
      });
    }
    if (this.inventoryFilters.length > 0) {
      const dialogRef = this.dialog.open(AddFiltersDialogComponent, {
        width: '500px',
        data: {
          companyID: this.userData.companyId,
          filters: this.inventoryFilters,
          filterId: this.defaultFilter,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.getFilters();
        console.log('The dialog was closed');
      });
    }
  }

  // Reset table filters
  resetFilters() {
    this.filterValues = {};
    this.filterSelectObj.forEach((value, key) => {
      value.modelValue = '';
      value.queryType = undefined;
    });
    this.SearchAllTextVal = '';
    this.inventoryFilters = [];
    this.defaultFilter = '';
    this.getProductList();
    this.getFilters();
  }

  // Get Unique values from columns to build filter
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
    if (filter === 'All') {
      //  if(this.SearchAllTextVal!=""){
      let inventoryFilter = {
        companyId: this.userData.companyId,
        columnName: filter,
        queryType: 'contains',
        filterValue: this.SearchAllTextVal,
      };
      this.inventoryFilters.forEach((value, key) => {
        if (value.columnName == '') {
          this.inventoryFilters.splice(0, 1);
        }
        if (value.columnName == inventoryFilter.columnName) {
          value.queryType = inventoryFilter.queryType;
          value.filterValue = inventoryFilter.filterValue;
        } else {
          let data = this.inventoryFilters.find(
            (ob) => ob.columnName === inventoryFilter.columnName
          );
          if (data === undefined) {
            this.inventoryFilters.push(inventoryFilter);
          }
        }
      });
    } else {
      if (filter.queryType == undefined) {
        filter.queryType = 'contains';
      }

      let inventoryFilter = {
        companyId: this.userData.companyId,
        columnName: filter.columnProp,
        queryType: filter.queryType,
        filterValue: filter.modelValue,
      };

      this.inventoryFilters.forEach((value, key) => {
        if (value.columnName == '') {
          this.inventoryFilters.splice(0, 1);
        }
        if (value.columnName == inventoryFilter.columnName) {
          value.queryType = inventoryFilter.queryType;
          value.filterValue = inventoryFilter.filterValue;
        } else {
          let data = this.inventoryFilters.find(
            (ob) => ob.columnName === inventoryFilter.columnName
          );
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
            searchTerms[col]
              .trim()
              .toLowerCase()
              .split(' ')
              .forEach((word) => {
                if (
                  data[col].toString().toLowerCase().indexOf(word) != -1 &&
                  isFilterSet
                ) {
                  found = true;
                }
              });
          }
          return found;
        } else {
          return true;
        }
      };
      return nameSearch();
    };
    return filterFunction;
  }

  getFilterSelectObj() {
    // Object to create Filter for
    this.filterSelectObj = [
      {
        name: 'sku',
        columnProp: 'sku',
        options: ['Equals to', 'contains'],
      },
      {
        name: 'Title',
        columnProp: 'title',
        options: ['Equals to', 'contains'],
      },
      {
        name: 'ASIN',
        columnProp: 'asin',
        options: ['Equals to', 'contains'],
      },
      {
        name: 'Cost Price',
        columnProp: 'initialCostPrice',
        options: [
          'Equals to',
          'contains',
          'less than or equal to',
          'greater than or equal to',
        ],
      },
      {
        name: 'Selling Price',
        columnProp: 'retailPrice',
        options: [
          'Equals to',
          'contains',
          'less than or equal to',
          'greater than or equal to',
        ],
      },
      {
        name: 'Quantity',
        columnProp: 'quantity',
        options: [
          'Equals to',
          'contains',
          'less than or equal to',
          'greater than or equal to',
        ],
      },
    ];
  }

  ngOnInit() {
    this.userData = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    this.getUserMarketplacesRegions();
    this.getFilters();
  }

  getDisplayColumns() {
    if (!this.permissionsHelper.isEditable('inventory')) {
      this.displayedColumns = [
        'select',
        'sku',
        'title',
        'asin',
        'initialCostPrice',
        'retailPrice',
        'quantity',
        'actions',
      ];
    }
  }

  onPageChangeEvent(event) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getProductList();
  }

  //To get products
  getProductList() {
    if (this.userMarketplace.userMarketplaceSiteMapId == undefined) {
      this.notificationService.Error('Please Select Account');
      return false;
    }
    this.selection.clear();
    if (this.inventoryFilters.length > 0) {
      this.inventoryFilters.forEach((value, key) => {
        if (value.filterValue == '') {
          this.inventoryFilters.splice(key, 1);
        }
      });
    }
    if (this.inventoryFilters.length == 0) {
      this.inventoryFilters = [
        {
          companyId: this.userData.companyId,
          columnName: '',
          queryType: '',
          filterValue: '',
        },
      ];
    }
    var inventoryFilterPagingVM = {
      inventoryFilters: this.inventoryFilters,
      hasAsin: this.hasAsin,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };

    this.inventoryService.getFilterdProducts(inventoryFilterPagingVM).subscribe(
      (response) => {
        if (response.body.data !== null) {
          this.products = response.body.data;
          this.metaData = response.body.meta;
          this.dataSource.data = this.products;
          this.updatePaginator(this.metaData.totalRecords);
        } else {
          this.products = [];
          this.metaData = new Metadata();
        }
      },
      (error) => {
        this.notificationService.Error(
          'Something went wrong. Please try again later.'
        );
      }
    );
  }

  updatePaginator(filteredDataLength: number) {
    Promise.resolve().then(() => {
      if (!this.paginator) {
        return;
      }
      this.paginator.length = filteredDataLength;
      // If the page index is set beyond the page, reduce it to the last page.
      if (this.paginator.pageIndex > 0) {
        const lastPageIndex =
          Math.ceil(this.paginator.length / this.paginator.pageSize) - 1 || 0;
        this.paginator.pageIndex = Math.min(
          this.paginator.pageIndex,
          lastPageIndex
        );
      }
    });
  }

  //getUserMarketplacesRegions
  getUserMarketplacesRegions() {
    this.listingService
      .getUserMarketplacesRegions(this.userData.companyId, Channels.eBay)
      .subscribe(
        (response) => {
          if (response.body.status == 200) {
            this.accounts = response.body.data;
          } else {
            this.notificationService.Error(response.body.message);
          }
        },
        (error) => {
          this.notificationService.Error(error.message);
        }
      );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /* Handle acount change event*/
  handleAccountChange(event) {
    this.userMarketplace = this.accounts.find(
      (x) => x.userMarketplaceSiteMapId == event.value
    );
    this.getProductList();
  }

  /* Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    let numSelected = this.selection.selected.length;

    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  //Checkbox change handler
  handleCheckChanged(event, row) {
    if (event.checked == true) {
      let numSelected = this.selectedRows.length;
      if (numSelected >= 5) {
        this.notificationService.Warning(
          'eBay API support upto 5 items listing at a time.'
        );
        event.source._checked = false;
        return;
      }
      this.selectedRows.push(row);
    } else {
      this.selectedRows = this.selectedRows.filter(
        (c) => c.inventoryId != row.inventoryId
      );
    }
  }

  /* Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  openeBayCategorySpecificationsSettingsDialogForBulkListing(
    inventoryIds
  ): void {
    const dialogRef = this.dialog.open(
      EbayCategorySpecificationsDialogComponent,
      {
        width: '1000px',
        data: {
          inventoryIds: inventoryIds,
          userMarketplace: this.userMarketplace,
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.selectedRows = [];
      //this.getProductList();
    });
  }

  //eBay category specifications settings dialog
  openeBayCategorySpecificationsSettingsDialog(inventoryId): void {
    const dialogRef = this.dialog.open(
      EbayCategorySpecificationsDialogComponent,
      {
        width: '1000px',
        data: {
          inventoryId: inventoryId,
          userMarketplace: this.userMarketplace,
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  handlePresetChange(inventoryid, event) {
    if (event.value != undefined) {
      this.presetModel = this.ebayPresets.find(
        (x) => x.eBayPresetsId == event.value
      );
    }
  }

  //eBay category specifications settings dialog
  openeBayPresetsDialog(inventoryId): void {
    const dialogRef = this.dialog.open(EbayPresetsDialogueComponent, {
      width: '1200px',
      panelClass: 'full-width-dialog',
      data: {
        inventoryId: inventoryId,
        userMarketplace: this.userMarketplace,
        presetModel: this.presetModel,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      //this.getProductList();
    });
  }

  bulkAssignListingProfile() {
    if (this.selection.selected.length > 0) {
      let inventoryIDs = [];
      this.selection.selected.forEach((element) => {
        inventoryIDs.push(element.inventoryId);
      });
      this.openeBayCategorySpecificationsSettingsDialogForBulkListing(
        inventoryIDs
      );
    } else {
      this.notificationService.Error('Please select atleast one item.');
    }
  }

  eBayProductListing() {
    let numSelected = this.selection.selected.length;
    if (numSelected > 5) {
      this.notificationService.Warning(
        'eBay API support upto 5 items listing at a time. Please select and send products feed upto 5 items.'
      );
      return;
    }

    if (this.selection.selected.length > 0) {
      let inventoryIDs = [];
      this.selection.selected.forEach((element) => {
        inventoryIDs.push(element.inventoryId);
      });
      let postData = {
        companyId: this.userData.companyId,
        userMarketplaceId: this.userMarketplace.userMarketplaceId,
        userMarketplaceSiteId: this.userMarketplace.userMarketplaceSiteMapId,
        inventoryIds: inventoryIDs,
      };
      this.listingService.createeBayInventoryListing(postData).subscribe(
        (response) => {
          if (response.body.status === 200) {
            this.selectedRows = [];
            this.getProductList();
            this.notificationService.Success(response.body.message);
          } else {
            this.notificationService.Error(response.body.message);
          }
        },
        (error) => {
          this.notificationService.Error(error.message);
        }
      );
    } else {
      this.notificationService.Error('Please select atleast one item.');
    }
  }
}
