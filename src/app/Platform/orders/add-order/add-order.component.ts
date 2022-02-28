import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { CustomerService } from '../../customers/services/customer.service';
import { InventoryService } from '../../inventory/services/inventory.service';
import { MarketplacesService } from '../../marketplaces/services/marketplaces.service';
import { UsersService } from '../../settings/services/users.service';
import { OrderService } from '../services/order.service';
import { ShippingPackageService } from '../../shipping-package/service/shipping-package.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss'],
})
export class AddOrderComponent implements OnInit {
  shippingPackageName: any = [];
  isEdit: boolean = true;
  Gtotal: any = [0];
  isEdit1: boolean = true;
  // discountt:any=[];
  tax1: any = 0;
  totalPrice: any = 0;
  costPrice: any = 0;
  sellingPrice: any = 0;
  title: any = [];
  currentUser: any;
  price: any = 0;
  discountvalue: any = 0;
  disable: boolean = false;
  orderId: any;
  data: any = [];
  products: any = [];
  // company: any = [];
  submitted: boolean = false;
  channel: any;
  customer: any = [];
  Edit: boolean = false;
  supplier: any = [];
  loading: boolean = false;
  purchaseOrderForm: FormGroup;
  sub: any;
  cd: any;
  userData: any;
  totalRecords: number = 0;
  pageNumber: number = 1;
  first = 0;
  last = 0;
  pageSize: number = 10;
  order = 'asc';
  isActive = true;
  orderBy: any = [
    {
      orderBy: 'asc',
      name: 'ascending',
    },
    {
      orderBy: 'desc',
      name: 'descending',
    },
  ];
  orderDirection: any = 'ShippingPackageId';
  search: any = null;
  tableData: any;
  shippingPackage: any;
  buyPrice: any = 0;
  Totalprofit: any;
  sellingPrice1: any;

  constructor(
    private is: InventoryService,
    private sp: ShippingPackageService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private marketplaceservice: MarketplacesService,
    private inventoryservice: InventoryService,
    private Orderservice: OrderService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initializeFormControls();
    this.getProductList();
    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    this.cd = this.currentUser.companyId;
    this.getGlobalData();
    this.getInventory();
    this.getSupplier();
    this.readQuery();
    if (this.orderId > 0) {
      this.loading = true;
      this.GetProductOrdersById(this.orderId);
    }
    this.getList();
  }

  async getList() {
    let param = {
      companyId: this.cd,
      pageNumber: this.pageNumber,
      isActive: this.isActive,
      pageSize: this.pageSize,
      orderDirection: this.order,
      orderBy: this.orderDirection,
      search: this.search,
    };
    await this.sp.getShippingList(param).subscribe((res) => {
      this.shippingPackageName = res.body.data;
    });
  }

  getProductList() {
    let id = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    this.is.getProductList(id.companyId).subscribe((res) => {
      this.title = res.body.data;
    });
  }

  onlyacceptnumber(e) {
    let invalidChars = ['+', '-', 'e'];

    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  }

  //To read query string values
  private readQuery() {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.orderId = params['orderID'];
    });
  }

  GetProductOrdersById(orderId) {
    this.loading = true;
    this.Edit = true;
    this.Orderservice.getPurchaseOrdersById(orderId).subscribe(async (res) => {
      this.disable = true;
      let value = res.body.data;
      this.purchaseOrderForm.patchValue({
        companyId: value.companyId,
        companyName: value.companyName,
        createdBy: value.createdBy,
        createdDate: value.createdDate,
        deletedBy: value.deletedBy,
        deletedDate: value.deletedDate,
        description: value.description,
        discountvalue: value.discountvalue,
        fulfillment_Status: value.fulfillment_Status,
        grandTotal: value.grandTotal,
        isActive: value.isActive,
        isDeleted: value.isDeleted,
        modifiedBy: value.modifiedBy,
        modifiedDate: value.modifiedDate,
        orderId: value.orderId,
        pO_Date: value.pO_Date,
        pO_Number: value.pO_Number,
        productId: value.productId,
        title: value.title,
        quantity: value.quantity,
        shippingPackageId: value.shippingPackageId,
        shippingPackageName: value.shippingPackageName,
        shipping_Price: value.shipping_Price,
        sku: value.sku,
        profit: value.profit,
        costPrice: value.costPrice,
        sellingPrice1: value.sellingPrice1,
        subtotal_Price: value.subtotal_Price,
        supplierId: value.supplierId,
        supplierName: value.supplierName,
        tax: value.tax,
        buyPrice: value.buyPrice,
        total_Price: value.total_Price,
        tracking_Number: value.tracking_Number,
        warehouse_id: value.warehouse_id,
        discount: value.discount,
      });
      this.hideloader();
    });
  }

  hideloader() {
    this.loading = false;
  }

  public initializeFormControls() {
    this.purchaseOrderForm = this.formBuilder.group({
      orderId: [0],
      shippingPackageId: ['', Validators.required],
      inventoryId: [''],
      productId: ['', Validators.required],
      sku: [''],
      title: [''],
      companyName: [''],
      description: [''],
      inventoryName: [''],
      companyId: [0],
      nullable: [true],
      quantity: ['', Validators.required],
      pO_Number: [''],
      warehouse_id: [''],
      tracking_Number: [''],
      pO_Date: [''],
      subtotal_Price: [0],
      shipping_Price: [0],
      total_Price: [0],
      tax: [0],
      discount: [0],
      grandTotal: [0],
      buyPrice:[0],
      profit: [0],
      totalOrder: [0],
      fulfillment_Status: ['', Validators.required],
      supplierId: ['', Validators.required],
      supplierName: [''],
      isActive: [true],
      createdDate: [''],
      createdBy: [0],
      modifiedDate: ['2021-08-27T13:16:40.017Z'],
      modifiedBy: [0],
      isDeleted: [true],
      deletedBy: [0],
      deletedDate: ['2021-08-27T13:16:40.017Z'],
    });
  }
  get f() {
    return this.purchaseOrderForm.controls;
  }

  getSupplier() {
    this.inventoryservice
      .getSuppliers(this.currentUser.companyId)
      .subscribe((res) => {
        this.supplier = res.body.data;
      });
  }

  getInventory() {
    this.inventoryservice
      .getProductList(this.currentUser.companyId)
      .subscribe((res) => { });
  }

  getGlobalData() {
    this.marketplaceservice.getAllGlobalMarketPlace().subscribe((res) => {
      this.data = res.body.data;
    });
  }

  getShippingPrice(e: any) {
    let first = e.target.value;
    let filter = this.shippingPackageName.find(
      (x) => x.shippingPackageId == first
    );
    if (filter === undefined || filter === null) {
      this.price = 0;
    } else {
      this.price = filter.price;
      this.Gtotal = parseFloat(this.price);
    }
    this.totalPrice = parseFloat(this.price) + parseFloat(this.sellingPrice);
    this.profit1();
  }

  subTotal(e: any) {
    let find = this.title.find((x) => x.products.productId == e.target.value);
    if (find === undefined || find === null) {
      this.sellingPrice = 0;
    } else {
      this.sellingPrice =
        find.products.sellingPrice === null ? 0 : find.products.sellingPrice;
    }

    if (find) {
      this.buyPrice = find.products.buyPrice;
    }

    this.totalPrice = parseFloat(this.price) + parseFloat(this.sellingPrice);
    this.Gtotal = this.totalPrice;
    this.profit1()

  }

  prodPrice(e: any) {
    if (e.target.value == '') {
      this.sellingPrice = 0;
    } else {
      this.sellingPrice = e.target.value;
    }

    this.totalPrice = parseFloat(this.price) + parseFloat(this.sellingPrice);
    this.Gtotal =
      parseFloat(this.totalPrice) +
      parseFloat(this.tax1) -
      parseFloat(this.discountvalue);
  }

  shipPrice(e: any) {
    if (e.target.value == '') {
      this.price = 0;
    } else {
      this.price = e.target.value;

    }

    this.totalPrice = parseFloat(this.price) + parseFloat(this.sellingPrice);
    this.Gtotal =
      parseFloat(this.totalPrice) +
      parseFloat(this.price) +
      parseFloat(this.tax1) -
      parseFloat(this.discountvalue);

    this.profit1();

  }

  totPrice(e: any) {
    if (e.target.value == '') {
      this.totalPrice = 0;
    } else {
      this.totalPrice = e.target.value;
    }

  }

  handletax(e: any) {
    if (e.target.value == '') {
      this.tax1 = 0;
    } else {
      this.tax1 = e.target.value;
    }

    this.Gtotal =
      parseFloat(this.totalPrice) +
      parseFloat(this.tax1) -
      parseFloat(this.discountvalue);
  }

  discount(e: any) {
    if (e.target.value == '') {
      this.discountvalue = 0;
    } else {
      this.discountvalue = e.target.value;
    }


    this.Gtotal =
      parseFloat(this.totalPrice) +
      parseFloat(this.tax1) -
      parseFloat(this.discountvalue);

    this.profit1();

  }



  profit1() {
    debugger;
    this.Totalprofit = parseFloat(this.Gtotal) - parseFloat(this.buyPrice) - parseFloat(this.discountvalue) - parseFloat(this.price);

  }

  onSubmit(event: any) {
    this.submitted = true;
    if (!this.purchaseOrderForm.invalid) {
      let postData = this.purchaseOrderForm.value;
      postData.companyId = this.currentUser.companyId;
      this.Orderservice.addPurchaseOrder(postData).subscribe(
        (response) => {
          if (response.body.status == 200 && response.body.data != null) {
            this.notificationService.Success(response.body.message);
            this.router.navigate(['/orders/order-listing']);
          } else {
            this.notificationService.Error(response.body.message);
          }
        },
        (error) => {
          console.log('this.error', error);
          this.notificationService.Error(error.message);
        }
      );
    }
  }
}
