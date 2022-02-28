import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { cssNumber } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';
import { OrderByPipe } from 'src/app/shared/sort.pipe';
import { CustomerService } from '../../../customers/services/customer.service';
import { ShippingPackageService } from '../../../shipping-package/service/shipping-package.service';
import { NotificationService } from '../../../../../../libs/core-services/src/lib/notification-service/notification.service';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  [x: string]: any;
  inventoryData: any;
  productImage: any = [];
  form: FormGroup;
  userData: any;
  shippingPackageDetails:any;
  files: any[] = [];
  image: any = [];
  form2: any;
  form3: FormGroup;
  form5: FormGroup;
  form6: FormGroup;
  previewPage: boolean = false;
  categoryName = '';
  cat:any=[];
  form4: FormGroup;
  productId = null;
  loading: boolean = false;
  isEdit: boolean = false;
  index: number = 0;
  category: any=[];
  inventoryImage: any;
  subcategories: any;
  isDeleteAll: any;
  myFiles: string[] = [];
  sum: any = [0];
  isEdit1: boolean = true;
  discount1: any = [0];
  price1: any = [0];
  tax1: any = [0];
  Edit: boolean = false;
  submitted: boolean = false;
  product: any = [];
  customer: any = [];
  suplier: any = [];
  packageId;
  productWeight: any;
  productHeight: any;
  productLength: any;
  productWidth: any;
  addressLine: any;
  condition:any;
  constructor(
    public fb: FormBuilder,
    public inventoryService: InventoryService,
    public activateRoute: ActivatedRoute,
    private customerService: CustomerService,
   private shippingService: ShippingPackageService,
    public router: Router,
    private notificationService:NotificationService,
    public toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userData = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    this.activateRoute.params.subscribe((res: any) => {
      this.productId = res.id;
    });

    this.form = this.fb.group({
      inventoryId: [0],
      productId: [0],
      companyId: [this.userData.companyId],
      sku: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      shortDescription: ['', [Validators.required]],
      sellingPrice: [0],
      specialSellingPrice: [0],
      itemType: [''],
      categoryId: ['', Validators.required],
      subCategoryId: [0],
      categoryName: [''],
      brandId: [0],
      heightUnit: [''],
      lengthUnit: [''],
      widthUnit: [''],
      supplierId: [''],
      metaTitle: [''],
      metaTag: [''],
      metaDescription: [''],
      visibility: [true],
      lowStock: [0],
      quantity: [0],
      barcode: [''],
      weight: [0],
      weightUnit: [''],
      buyPrice: [0],
      initialCostPrice: [0],
      wholeSalePrice: [0],
      retailPrice: [0],
      asin: [''],
      barcodeType: [''],
      bulletPoint1: [''],
      bulletPoint2: [''],
      bulletPoint3: [''],
      bulletPoint4: [''],
      bulletPoint5: [''],
      amazonTaxCode: [''],
      startPrice: [0],
      buyItNowPrice: [0],
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
      // dimentionUnits: [""],
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
      minimumPrice: [0],
      maximumPrice: [0],
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
    });
    this.form2 = this.fb.group({
      inventoryVariations: this.fb.array([]),
    });
    this.form3 = this.fb.group({
      inventoryImages: this.fb.array([]),
    });
    this.form4 = this.fb.group({
      inventoryVariationAttributes: this.fb.array([]),
    });

    this.form6 = this.fb.group({
      productId: [0],
      shippingPackageId: [0],
      title: [''],
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
    this.getSuppliers();
    this.getCustomer();

    this.getImagesArray();
    this.form5 = this.fb.group({
      customInventoryDetails: this.fb.array([]),
    });
    this.loadcustomInventoryDetails();
    this.inventoryVariationAttributes();
    this.getinventoryVariations();

    this.inventoryService
      .getCategories(this.userData.companyId)
      .subscribe((res) => {
        this.categories = res.body.data;
        this.category = this.categories?.filter(
          (categories) =>
            categories.parentCategoryId == null ||
            categories.parentCategoryId == 0
        );
      });

    this.inventoryService.getConditions().subscribe((res) => {
      this.condition = res.body.data;
    });
    this.getSupplier();
    // this.loadinventoryVariations();
    this.loading = false;
    if (this.productId != null) {
      this.loading = true;
      this.isEdit = true;
      this.getProduct(this.productId);
    }
  }
  suppliers: any;
  duplicate: boolean = false;
  getSupplier() {
    this.inventoryService
      .getSuppliers(this.userData.companyId)
      .subscribe((res) => {
        this.suppliers = res.body.data;
      });
  }

  onChangeSku() {
    let sku = this.form.value.sku;
    let inventoryID = this.form.value.inventoryId;
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

  onlyacceptnumber(e) {
    let invalidChars = ['-', '+', 'e'];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  }

  getProduct(id) {
     this.inventoryService.getProductById(id).subscribe((res) => {
      let data = res.body.data;
      this.subcategories = this.categories?.filter(
        (category) => category.parentCategoryId == data.products.categoryId
      );
      this.form.patchValue(data.products);
      this.form6.patchValue(data.shippingPackageDetails);
      this.loading = false;
      this.categoryName = data.products.productId;
      this.productImage = data.productImages;
      this.form3.patchValue(data.productImages);
      this.geinventoryVariations.setValue(data.productVariations);
      if (data.productVariations.length > 1) {
        this.getinventoryVariations();
      }
    });
  }

  inventoryVariationAttributes() {
    let arr = this.form4.get('inventoryVariationAttributes') as FormArray;
    let group = this.fb.group({
      inventoryVariationAttributeId: [0],
      inventoryVariationId: [0],
      attributeNameId: [0],
      attributeValueId: 0,
    });
    return arr.push(group);
  }

  loadcustomInventoryDetails() {
    let arr = this.form5.get('customInventoryDetails') as FormArray;
    let group = this.fb.group({
      inventoryCustomFieldId: [0],
      customAttributeKey: '',
      customAttributeValue: '',
      customAttributeValueType: '',
    });
    return arr.push(group);
  }

  get loadinventoryImages(): FormArray {
    return this.form3.get('inventoryImages') as FormArray;
  }
  getImagesArray() {
    this.loadinventoryImages.push(this.imageArray());
  }

  imageArray(): FormGroup {
    return this.fb.group({
      inventoryId: [],
      imageUrl: [],
      fileName: [],
      fileType: [],
      s3ImageURL: [],
      inventoryImageId: [0],
      isDeleteAll: [true],
      isURL: [true],
      isPrimaryImage: [true],
    });
  }

  preview() {
    this.previewPage = true;
    this.inventoryData = this.form.value;
    this.inventoryImage = this.form3.value;
  }

  get geinventoryVariations(): FormArray {
    return this.form2.get('inventoryVariations') as FormArray;
  }

  loadinventoryVariations(): FormGroup {
    return this.fb.group({
      productVariationId: [0],
      companyId: [this.userData.companyId],
      productId: this.form.value.productId,
      combinationId: [0],
      varationTitle: '',
      sku: '',
      barcode: '',
      price: [0],
      sellingPrice: [0],
      buyPrice: [0],
      initialCostPrice: [0],
      wholeSalePrice: [0],
      retailPrice: [0],
      originalQuantity: [0],
      availableQuantity: [0],
      orderedQuantity: [0],
      lowStockAlertQuantity: [0],
      lowStockFirstAlertDate: '',
      outOfStockDate: '',
      asin: '',
      ean: '',
      upc: '',
      isbn: '',
      gcid: '',
    });
  }

  getinventoryVariations() {
    this.geinventoryVariations.push(this.loadinventoryVariations());
  }

  prepareFilesList(event) {
    let files: Array<any> = event.target.files;
    for (const item of files) {
      this.files.push(item);
      let reader = new FileReader();
      reader.readAsDataURL(item);
      let imagebuild;
      reader.onload = (e) => {
        (imagebuild = e.target.result.toString()), this.image.push(imagebuild);
        this.isUploaded = true;
      };
    }

    let arr: any = [];
    setTimeout(() => {
      for (let i = 0; i < this.files.length; i++) {
        let group = {
          inventoryId: this.form.value.inventoryId,
          imageUrl: this.image[i],
          fileName: this.files[i].name,
          fileType: this.files[i].type,
          s3ImageURL: this.image[i],
          inventoryImageId: 0,
          isDeleteAll: this.isDeleteAll ? this.isDeleteAll : true,
          isURL: true,
          isPrimaryImage: true,
        };

        arr.push(group);
        if (i > 0) {
          this.getImagesArray();
        }
      }

      this.loadinventoryImages.setValue(arr);
    }, 50);
  }

  categoryChanged(e) {
    let categoryId = e;
    this.inventoryService
      .GetSubCategories(this.userData.companyId, categoryId)
      .subscribe((res) => {
        this.subcategories = res.body.data;
      });
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
    this.image.splice(index, 1);
    this.index = index;

    this.loadinventoryImages.removeAt(index);
  }

  // getFileDetails(e){
  //   for(var i=0;i < e.target.files.length; i++){
  //     this.myFiles.push(e.target.files[i]);
  //   }
  // }

   // create  shipping package
   getCustomer() {
    this.customerService.getCustomersByCompany(this.userData.companyId).subscribe(res => {
      this.customer = res.body.data;
    })
  }
  getSuppliers() {
    this.inventoryService.getSuppliers(this.userData.companyId).subscribe(res => {
      this.suplier = res.body.data;
    })
  }

  getproduct() {
    this.inventoryService.getProductList(this.userData.companyId).subscribe(res => {
      this.product = res.body.data;
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


  onSubmit() {
    this.submitted=true;
    let categoryNames = this.category.filter(
      (response) => response.categoryId == this.form.value.categoryId
    );
    this.loading = true;
    if (this.form.invalid || this.duplicate || this.form6.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.controls[key].markAsDirty();
      });
      this.loading = false;
      return;
    }

    let inventory = this.form.value;
    let inventoryVariations = this.form2.value;
    let inventoryImages = this.form3.value;
    let shippingPackageDetails = this.form6.value;
    let customInventoryDetails = this.form5.value;
    let inventoryVariationAttributes = this.form4.value;
    if (this.productId == null) {
      this.inventoryService
        .createProduct({
          inventory,
          inventoryImages,
          inventoryVariations,
          inventoryVariationAttributes,
          customInventoryDetails,
          shippingPackageDetails
        })
        .subscribe((res) => {
          console.log(res)
          this.toastr.success('success', 'Product Added Successfully', {
            timeOut: 4000,
          });
          this.loading = false;
          this.router.navigate(['inventory/manage-product']);
        });
    } else {
      debugger;
      this.inventoryService
        .updateProduct({
          inventory,
          inventoryImages,
          inventoryVariations,
          inventoryVariationAttributes,
          customInventoryDetails,
          shippingPackageDetails
        })
        .subscribe((res) => {
          this.inventoryService
            .uploadProductImages({
              companyId: inventory.companyId,
              inventoryId: inventory.inventoryId,
              inventoryImages: inventoryImages.inventoryImages,
            })
            .subscribe((response) => {});
          this.toastr.success(res.body.message);
          this.router.navigate(['inventory/manage-product']);
        });
    }
  }

  back() {
    this.router.navigate(['inventory/manage-product']);
  }
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes({ bytes, decimals }) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  get f() {
    return this.form.controls;
  }
  get f6(){
    return this.form6.controls;
  }
}
