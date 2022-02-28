import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent implements OnInit, OnDestroy {
  @Input() invent: any;
  data: any = [];
  loading: boolean = true;
  productId: any;
  imageSource;
  checked1: boolean;

  constructor(
    public inventoryService: InventoryService,
    public toastrService: ToastrService,
    public router: Router,
    public activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.invent != undefined) {
      this.data = { inventory: this.invent };
    } else {
      this.activateRoute.paramMap.subscribe((res: any) => {
        this.productId = res.params.id;
      });
      this.getdata(this.productId);
    }
  }
  getdata(id) {
    this.inventoryService.getProductById(id).subscribe((res) => {
      this.data = res.body.data;
      this.loading = false;
      this.checked1 = this.data.products.visibility;
      let data1;
      this.data.productImages.map((data) => {
        data1 = data;
      });
    });
  }
  edit() {
    this.router.navigate([`inventory/edit-product/${this.productId}`]);
  }
  back() {
    this.router.navigate([`inventory/manage-product`]);
  }
  ngOnDestroy() {}
}
