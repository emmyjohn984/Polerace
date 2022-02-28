import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/Platform/customers/services/customer.service';
import { InventoryService } from 'src/app/Platform/inventory/services/inventory.service';
import { ShippingPackageService } from '../../service/shipping-package.service';

@Component({
  selector: 'app-create-shipping-package',
  templateUrl: './create-shipping-package.component.html',
  styleUrls: ['./create-shipping-package.component.scss']
})
export class CreateShippingPackageComponent implements OnInit {
  sum: any = [0];
  isEdit1: boolean = true;
  discount1: any = [0];
  price1: any = [0];
  tax1: any = [0];
  form: FormGroup;
  Edit: boolean = false;
  submitted: boolean = false;
  userData: any;
  product: any = [];
  customer: any = [];
  loading: boolean = true;
  suplier: any = [];
  packageId;
  productWeight: any;
  productHeight: any;
  productLength: any;
  productWidth: any;
  addressLine: any;
  constructor(private fb: FormBuilder, private router: Router, private activateRoute: ActivatedRoute, private customerService: CustomerService, private shippingService: ShippingPackageService, private inventoryService: InventoryService, private toastrService: ToastrService, private notificationService:NotificationService) { }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('currentUser') ? localStorage.getItem('currentUser') : sessionStorage.getItem('currentUser'));
    this.activateRoute.params.subscribe((res: any) => {
      this.packageId = res.id
    })

    this.form = this.fb.group({
      shippingPackageId: [0],
      productId: [0],
      shippingPackageName: ['', Validators.required],
      companyId: [this.userData.companyId],
      quantity: [0, [Validators.required,Validators.pattern('^[1-9][0-9]*$')]],
      height: ['', Validators.required],
      weight: ['', Validators.required],
      width: ['', Validators.required],
      length: ['', Validators.required],
      weightUnit: ['', Validators.required],
      heightUnit: ['', Validators.required],
      lengthUnit: ['', Validators.required],
      widthUnit: ['', Validators.required],
      billingAddress: ['', Validators.required],
      price: [0, [Validators.required]],
      discount: [0, Validators.required],
      taxes: [0],
      totalPrice: [0],
      supplierId: ['', Validators.required],
      supplierAddress: ['', Validators.required],
      isActive: [true],
      createdBy: [0]
    });
    this.loading = false;
    this.getproduct();
    this.getSupplier();
    this.getCustomer();
    if (this.packageId != undefined) {
      this.getformValue();
    }
  }
  getCustomer() {
    this.customerService.getCustomersByCompany(this.userData.companyId).subscribe(res => {
      this.customer = res.body.data;
    })
  }

  onlyacceptnumber(e) {
    let invalidChars = ["+", "-", "e"]
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }

  }

  getformValue() {
    this.Edit = true;
    this.shippingService.getShippingPackage(this.packageId).subscribe(res => {
      this.loading=true;
      if(res.body.data){
        let value = res.body.data[0];
        this.form.patchValue({
          shippingPackageId: Number(this.packageId),
          shippingPackageName: value.shippingPackageName,
          productId: value.productId,
          orderId: value.orderId,
          companyId: value.companyId,
          quantity: value.quantity,
          price: value.price,
          height: value.height,
          weight: value.weight,
          width: value.width,
          length: value.length,
          lengthUnit: value.lengthUnit,
          heightUnit: value.heightUnit,
          weightUnit: value.weightUnit,
          widthUnit: value.widthUnit,
          productWeightUnit: value.productWeightUnit,
          shippingAddress: value.shippingAddress,
          billingAddress: value.billingAddress,
          totalPrice: value.totalPrice,
          discount: value.discount,
          taxes: value.taxes,
          createdBy: this.userData.userId,
          customerId: value.customerId,
          supplierId: value.supplierId,
          supplierAddress: value.supplierAddress,
          isActive: value.isActive,
        })
        this.loading=false;
      }else{
        this.loading=false;
      }
    },err=>{
      this.loading=false;
      this.notificationService.Error('Something went wrong. Please try again later.');
    })
  }
  getproduct() {
    this.inventoryService.getProductList(this.userData.companyId).subscribe(res => {
      this.product = res.body.data;
    })
  }

  getSupplier() {
    this.inventoryService.getSuppliers(this.userData.companyId).subscribe(res => {
      this.suplier = res.body.data;
    })
  }

  price(e: any) {
    if (e.target.value == "") {
      this.price1 = 0;
    } else {
      this.price1 = e.target.value;
    }
    this.sum = parseFloat(this.price1) - parseFloat(this.discount1) + parseFloat(this.tax1);
  }

  discoun(e: any) {
    if (e.target.value == "") {
      this.discount1 = 0;
    } else {
      this.discount1 = e.target.value;
    }
    this.sum = parseFloat(this.price1) - parseFloat(this.discount1) + parseFloat(this.tax1);
  }

  tax(e: any) {
    if (e.target.value == "") {
      this.tax1 = 0;
    } else {
      this.tax1 = e.target.value;
    }
    this.sum = this.tax1;
    this.sum = parseFloat(this.price1) - parseFloat(this.discount1) + parseFloat(this.tax1);
  }

  filterData(e: any) {
    let first = e.target.value;
    let filter = this.suplier.find(x => x.supplierId == first);
    this.addressLine = filter.addressLine1
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.form.invalid) {
      this.shippingService.createPackage(this.form.value).subscribe(res => {
        if (res.status === 200) {
          this.toastrService.success(res.body.message);
          this.router.navigate(['shipping-package'])
        }
      },
        err => {
          this.toastrService.error(err)

        });
    }
  }
}

