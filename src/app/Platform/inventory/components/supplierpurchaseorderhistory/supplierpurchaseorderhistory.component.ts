import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { InventoryService } from '../../services/inventory.service';
@Component({
  selector: 'app-supplierpurchaseorderhistory',
  templateUrl: './supplierpurchaseorderhistory.component.html',
  styleUrls: ['./supplierpurchaseorderhistory.component.scss'],
})
export class SupplierpurchaseorderhistoryComponent implements OnInit {
  suppliers: any;
  dataSource: any;
  loading: boolean = false;
  productlist: any;
  userData: any;
  filterOn: boolean = false;
  firstName: any = '';
  supId: number = 0;
  constructor(
    private inventoryService: InventoryService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.userData = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    this.getSuppliersList();
    this.onSupplierChange(this.supId);
  }

  //To get products
  getSuppliersList() {
    this.loading = true;
    this.inventoryService.getSuppliers(this.userData.companyId).subscribe(
      (response) => {
        if (response.body.data !== null) {
          this.suppliers = response.body.data;
          this.loading = false;
        } else {
          this.notificationService.Info(response.body.message);
          this.loading = false;
        }
      },
      (error) => {
        this.loading = false;
        this.notificationService.Error(error);
      }
    );
  }

  onSupplierChange(event) {
    this.loading = true;
    let comp = this.userData.companyId;
    this.inventoryService.getPurchaseOrderHIstory(comp, event).subscribe(
      (res) => {
        this.productlist = res.body.data;
        this.dataSource = this.productlist;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.notificationService.Error(
          'Something went wrong. Please try again later.'
        );
      }
    );
  }

  filterReset() {
    this.firstName = '';
    this.getSuppliersList();
    this.onSupplierChange(this.supId);
    // this.getPurchaseOrderList();
  }
}
  