import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { InventoryService } from '../../services/inventory.service';
import { Table } from 'primeng/table';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-categorylisting',
  templateUrl: './categorylisting.component.html',
  styleUrls: ['./categorylisting.component.scss'],
})
export class CategorylistingComponent implements OnInit {
  categories: Array<any> = [];
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
    'amazonItemTypeKeyword',
    'walmartCategoryName',
    'categoryDescription',
    'isActive',
    'createdDate',
  ];

  constructor(
    private inventoryService: InventoryService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')? localStorage.getItem('currentUser'): sessionStorage.getItem('currentUser'));
    this.cols = [
      { field: 'categoryName', header: 'Category Name' },
      { field: 'amazonItemTypeKeyword', header: 'Amazon TypeKeyword' },
      { field: 'walmartCategoryName', header: 'Walmart Category Name' },
      { field: 'categoryDescription', header: 'Category Description' },
      { field: 'isActive', header: 'Status' },
      { field: 'createdDate', header: 'Created Date' }
    ];
    this.getCategoryList();
  }

  //To get categories
  getCategoryList() {
    this.loading = true;
    this.inventoryService.getCategories(this.currentUser.companyId).subscribe(
      (response) => {
        if (response.body.data) {
          this.loading=false;
          this.categories = response.body.data;
          let category = this.categories.filter(
            (categories) =>
              categories.parentCategoryId == null ||
              categories.parentCategoryId == 0
          );
          this.dataSource = category;
          category.map((data: any) => {
            let categories = data;
            if (data.isActive == true) {
              data.isActive = 'Active';
            } else {
              data.isActive = 'InActive';
            }
          });
          if (!this.keys) {
            this.keys = Object.keys(this.dataSource[0]);
            this.keys.sort();
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
          this.totalRecords = this.categories.length;
          this.hideloader();
        } else {
          this.loading=false;
          console.log('this.message', response.body.message);
        }
      },
      (error) => {
        this.loading=false;
        this.notificationService.Error(error.message);
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

  showId(categoryID: number) {
    this.deleteId = categoryID;
  }

  deleteCategory(categoryId: number) {
    this.inventoryService.deleteCategory(categoryId).subscribe(
      async (response) => {
        this.loading=true;
        if (response.body.status == 200 && response.body.data != null) {
          this.notificationService.Success(response.body.message);
          this.getCategoryList();
          this.loading=false;
        } else {
          this.notificationService.Error(response.body.message);
          this.loading=false;
        }
      },
      (error) => {
        this.notificationService.Error(error.message);
        this.loading=false;
      }
    );
  }

  editCategory(categoryID: number) {
    this.router.navigate(['/inventory/addcategory'], {
      queryParams: { categoryID: categoryID },
    });
  }

  hideloader() {
    this.loading = false;
  }
}
