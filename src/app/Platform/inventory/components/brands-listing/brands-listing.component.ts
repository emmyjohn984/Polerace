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

@Component({
  selector: 'app-brands-listing',
  templateUrl: './brands-listing.component.html',
  styleUrls: ['./brands-listing.component.scss'],
})
export class BrandsListingComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'brandName',
    'createdDate',
    'isDefault',
    'isActive',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>();
  users: Array<any> = [];
  products: Array<any> = [];
  userData: any = {};

  constructor(
    private router: Router,
    private userService: UsersService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private inventoryService: InventoryService,
    public permissionsHelper: PermissionsHelper
  ) {
    this.getDisplayColumns();
  }

  ngOnInit() {
    this.userData = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    this.getBrandsList();
  }

  getDisplayColumns() {
    if (this.permissionsHelper.viewOnly('inventory')) {
      this.displayedColumns = [
        'brandName',
        'createdDate',
        'isDefault',
        'isActive',
      ];
    }
  }

  //To get products
  getBrandsList() {
    this.inventoryService.getBrands(this.userData.companyId).subscribe(
      (response) => {
        if (response.body.data !== null) {
          this.products = response.body.data;
          this.dataSource.data = this.products;
        } else {
          console.log('this.message', response.body.message);
        }
      },
      (error) => {
        console.log('this.error', error);
      }
    );
  }

  //Edit
  editUser(brandId) {
    this.router.navigate(['/inventory/addbrand'], {
      queryParams: { brandId: brandId },
    });
  }

  //Delete
  deleteUser(brandId) {
    this.inventoryService.deleteBrand(brandId).subscribe(
      (response) => {
        if (response.body.status == 200) {
          this.notificationService.Success('Brand has been deleted.');
          this.getBrandsList();
        } else {
          this.notificationService.Error(response.body.message);
        }
      },
      (error) => {
        console.log('this.error', error);
        this.notificationService.Error(error);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(userId) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '600px',
      data: {
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Ok',
          cancel: 'Cancel',
        },
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteUser(userId);
      }
    });
  }
}
