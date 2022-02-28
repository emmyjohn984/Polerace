import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatSort } from '@angular/material/sort';
import { InventoryService } from '../../services/inventory.service';
import { PermissionsHelper } from 'src/app/shared/helpers/permissions-helper';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-category-listing',
  templateUrl: './category-listing.component.html',
  styleUrls: ['./category-listing.component.scss']
})

export class CategoryListingComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['categoryName','amazonItemTypeKeyword','amazonCategoryNodeId','eBayCategoryID','walmartCategoryName', 'createdDate', 'isActive', "actions"];
  dataSource = new MatTableDataSource<any>();
  categories: Array<any> = [];
  currentUser: any = {};
  


  constructor(private router: Router, private notificationService: NotificationService, private dialog: MatDialog,
    private inventoryService: InventoryService, public permissionsHelper: PermissionsHelper) {
    this.getDisplayColumns();
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser'));
    this.getCategoryList();
  }

  getDisplayColumns() {
    if (this.permissionsHelper.viewOnly('inventory')) {
      this.displayedColumns = ['categoryName','amazonItemTypeKeyword','amazonCategoryNodeId','eBayCategoryID','walmartCategoryName', 'createdDate', 'isActive'];
    }

  }

  //To get products
  getCategoryList() {
    this.inventoryService.getCategories(this.currentUser.companyId).subscribe(response => {
      if (response.body.data !== null) {
        this.categories = response.body.data;
        this.dataSource.data = this.categories;
      }
      else {
        console.log("this.message", response.body.message);
      }
    }, error => {
      this.notificationService.Error("Something went wrong. Please try again later");
    });
  }

  //Edit
  editCategory(categoryID:number) {
    this.router.navigate(['/inventory/addcategory'], { queryParams: { categoryID: categoryID } });
  }

  //Delete
  deleteCategory(categoryID:number) {
    this.inventoryService.deleteCategory(categoryID).subscribe(response => {
      if (response.body.status == 200 && response.body.data != null) {
        this.notificationService.Success(response.body.message);
        this.getCategoryList();
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error(error.message);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(categoryID) {
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
        this.deleteCategory(categoryID);
      }
    });

  }


}
