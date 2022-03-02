import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-update-inventory',
  templateUrl: './update-inventory.component.html',
  styleUrls: ['./update-inventory.component.scss'],
})
export class UpdateInventoryComponent implements OnInit {
  inventoryUpdateForm: FormGroup;
  userData: any;
  loading: boolean = false;
  Edit: boolean = false;
  submitted: boolean = false;
  duplicate: boolean = false;
  suppliers: any;
  category: any;
  subcategories: any;
  condition: any;
  products: any;
  categories: any;
  inventoryId: number;
  categoryName = '';
  constructor(
    private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private tosterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.userData = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    this.initializeFormControls();
    this.getInventory();
    this.getSupplier();
    this.getCategories();
    this.readQuery();
    this.getProductById();

    if (this.inventoryId > 0) {
      this.Edit = true;
      this.loading = true;
    }
  }

  private initializeFormControls() {
    this.inventoryUpdateForm = this.formBuilder.group({
      inventoryId: [0],
      companyId: [this.userData.companyId],
      sku: ['', Validators.required],
      title: ['0', [Validators.required]],
      description: ['', [Validators.required]],
      shortDescription: ['', [Validators.required]],
      sellingPrice: [''],
      specialSellingPrice: [''],
      itemType: [''],
      categoryId: ['', Validators.required],
      subCategoryId: [''],
      categoryName: [''],
      brandId: [0],
      supplierId: ['', Validators.required],
      metaTitle: [''],
      metaTag: [''],
      metaDescription: [''],
      visibility: [true],
      lowStock: [0],
      quantity: [0],
      barcode: [''],
      weight: [0],
      weightUnit: [''],
      buyPrice: [''],
      initialCostPrice: [0],
      wholeSalePrice: [''],
      retailPrice: [''],
      asin: [''],
      barcodeType: [''],
      bulletPoint1: [''],
      bulletPoint2: [''],
      bulletPoint3: [''],
      bulletPoint4: [''],
      bulletPoint5: [''],
      amazonTaxCode: [''],
      startPrice: [0],
      buyItNowPrice: [''],
      reservePrice: [0],
      bestOfferAutoAcceptPrice: [0],
      startTime: '2021-08-03T14:48:11.861Z',
      endTime: '2021-08-03T14:48:11.861Z',
      charityName: [''],
      charityId: [''],
      isFeaturedCharity: true,
      donationPercentage: [0],
      subTitle: ['', Validators.required],
      bufferQuantity: [0],
      saleStartDate: '2021-08-03T14:48:11.862Z',
      saleEndDate: '2021-08-03T14:48:11.862Z',
      textDescription: [''],
      length: [0],
      width: [0],
      height: [0],
      dimentionUnits: [''],
      isBundleProduct: true,
      ean: [''],
      upc: [''],
      isbn: [''],
      gcid: [''],
      processingMinDays: [0],
      processingMaxDays: [0],
      isCustomizable: true,
      isSupply: true,
      location: [''],
      notes: [''],
      mpn: [''],
      labels: [''],
      classification: [''],
      conditionId: [0],
      manufacturerId: [0],
      flag: [''],
      blocked: true,
      minimumPrice: [''],
      maximumPrice: [''],
      brandName: ['', Validators.required],
      supplierName: [''],
      conditionName: [''],
      manufacture: ['', Validators.required],
      modifiedBy: [0],
      modifiedDate: '2021-08-03T14:48:11.862Z',
      deletedBy: [0],
      createdBy: [0],
      createdDate: '2021-08-03T14:48:11.862Z',
      isDeleted: false,
      isActive: true,
      eBayCategoryID: '',
      walmartCategoryName: '',
      amazonConditionValue: '',
      eBayConditionValue: '',
      walmartConditionValue: '',
      amazonCategoryNodeId: [0],
      productId: [0],
    });
  }

  get f() {
    return this.inventoryUpdateForm.controls;
  }

  private readQuery() {
    this.route.queryParams.subscribe((params) => {
      this.inventoryId = params['inventoryId'];
    });
  }

  getSupplier() {
    this.inventoryService
      .getSuppliers(this.userData.companyId)
      .subscribe((res) => {
        this.suppliers = res.body.data;
      });
  }

  onChangeSku() {
    let sku = this.inventoryUpdateForm.value.sku;
    let inventoryID = this.inventoryUpdateForm.value.inventoryId;
    this.inventoryService
      .checkProductSKUExist(inventoryID, sku, this.userData.companyId)
      .subscribe((res) => {
        if (res.body.data == true) {
          this.duplicate = true;
        } else {
          this.duplicate = false;
        }
      });
  }

  categoryChanged(e) {
    let categoryId = e;
    this.inventoryService
      .GetSubCategories(this.userData.companyId, categoryId)
      .subscribe((res) => {
        this.subcategories = res.body.data;
      });
  }

  onlyacceptnumber(e) {
    let invalidChars = ['-', '+', 'e'];

    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  }
  getProductById() {
    this.inventoryService
      .getinventoryByIdd(this.inventoryId)
      .subscribe((res) => {
        let data = res.body.data;
        if (data.inventory !== null) {
          this.subcategories = this.categories?.filter(
            (category) => category.parentCategoryId == data.inventory.categoryId
          );
          this.inventoryUpdateForm.patchValue(data.inventory);
          this.inventoryUpdateForm.patchValue({ title: data.inventory.title });
          this.loading = false;
          this.categoryName = data.inventory.productId;
          this.inventoryUpdateForm
            .get('title')
            .setValue(data.inventory.inventoryId);
          this.inventoryUpdateForm
            .get('title')
            .patchValue({ inventoryId: data.inventory.inventoryId });
          this.inventoryUpdateForm.patchValue({ title: data.inventory.title });
        } else {
          this.loading = false;
        }
      });
  }

  getInventory() {
    this.inventoryService
      .getProductList(this.userData.companyId)
      .subscribe((res) => {
        this.products = res.body.data;
      });
  }

  getCategories() {
    this.inventoryService
      .getCategories(this.userData.companyId)
      .subscribe((res) => {
        this.categories = res.body.data;
        this.category = this.categories.filter(
          (categories) =>
            categories.parentCategoryId == null ||
            categories.parentCategoryId == 0
        );
      });
  }

  onSubmit(e) {
    if (this.inventoryUpdateForm.invalid || this.duplicate) {
      Object.keys(this.inventoryUpdateForm.controls).forEach((key) => {
        this.inventoryUpdateForm.controls[key].markAsDirty();
      });
      this.loading = false;
      return;
    } else {
      let inventory = this.inventoryUpdateForm.value;
      let inventoryVariations = 0;
      let inventoryImages = 0;
      let customInventoryDetails = 0;
      let inventoryVariationAttributes = 0;
      this.inventoryService
        .updateInventory({
          inventory,
          inventoryImages,
          inventoryVariations,
          inventoryVariationAttributes,
          customInventoryDetails,
        })
        .subscribe((res) => {
          this.loading = false;
          this.router.navigate(['/inventory/inventory-listing']);
        });
    }
  }

  back() {
    this.router.navigate(['/inventory/inventory-listing']);
  }
}
