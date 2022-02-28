import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { InventoryService } from '../../services/inventory.service';
import { Table } from 'primeng/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-subcategory-listing',
  templateUrl: './subcategory-listing.component.html',
  styleUrls: ['./subcategory-listing.component.scss']
})
export class SubcategoryListingComponent implements OnInit {

  categories: Array<any> = [];
  subcategories: Array<any> = [];
  currentUser: any = {};
  dataSource: any;
  @ViewChild('dt') table: Table;
  totalRecords: number;
  loading: boolean = false;
  isActive: any;
  active: any;
  deleteId: number;
  cols: any;
  keys: any;
  rowData: any = [];
  selectedColoumns: any[];
  baseColoumns = [
    'categoryName',
    'parentCategoryName',
    'amazonItemTypeKeyword',
    'walmartCategoryName',
    'categoryDescription',
    'isActive',
    'createdDate',
  ];

  constructor(private inventoryService: InventoryService, private notificationService: NotificationService, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') ? localStorage.getItem('currentUser') : sessionStorage.getItem('currentUser'));
    // this.getCategoryList();
    this.cols = [
      { field: 'categoryName', header: 'Subcategory Name' },
      { field: 'parentCategoryName', header: 'Category Name' },
      { field: 'amazonItemTypeKeyword', header: 'Amazon Type Keyword' },
      { field: 'categoryDescription', header: 'Category Description' },
      { field: 'walmartCategoryName', header: 'Walmart Category Name' },
      { field: 'isActive', header: 'Status' },
      { field: 'createdDate', header: 'Created Date' }
    ];
    this.getSubCategoriesByCompanyId();
  }

  showId(categoryID: number) {
    this.deleteId = categoryID
  }

  //To get categories
  getSubCategoriesByCompanyId() {
    this.inventoryService.getSubCategoriesById(this.currentUser.companyId).subscribe(response => {
      this.loading = true;
      if (response.body.data) {
        this.categories = response.body.data;
        this.dataSource = this.categories;
        this.totalRecords = this.categories.length;
        if (!this.keys) {
          this.keys = Object.keys(this.dataSource[0]);
          this.baseColoumns.map((res) => {
            if (this.keys.includes(res)) {
              if (this.keys.indexOf(res) > -1) {
                this.keys.splice(this.keys.indexOf(res), 1);
              }
            }
          });
          this.keys.map((res) => {
            this.rowData.push({ label: _.capitalize(res), value: res });
          });
        }
        this.loading = false;
      }
      else {
        this.loading = false;
      }
    }, error => {
      this.notificationService.Error("Something went wrong. Please try again later");
    });
    this.loading = false;
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
    this.selectedColoumns.map((res) => {
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

  deleteCategory(categoryId: number) {
    this.inventoryService.deleteCategory(categoryId).subscribe(response => {
      this.loading = true;
      if (response.body.status == 200 && response.body.data != null) {
        this.notificationService.Success(response.body.message);
        this.getSubCategoriesByCompanyId();
        this.loading = false;
      }
      else {
        this.notificationService.Error(response.body.message);
        this.loading = false;
      }
    }, error => {
      this.notificationService.Error("Something went wrong. Please try again later");
      this.loading = false;
    });
  }

  editCategory(categoryID: number) {
    this.router.navigate(['/inventory/addsubcategory'], { queryParams: { categoryID: categoryID } });
  }
}
