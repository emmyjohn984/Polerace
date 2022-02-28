import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { InventoryService } from '../../services/inventory.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CommonService } from 'src/app/shared/services/common.service';
import { ProductImages } from '../../models/product-images';
import { CustomAttributeComponent } from '../custom-attribute/custom-attribute.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  productForm: FormGroup;
  brands: Array<any> = [];
  suppliers: Array<any> = [];
  conditions: Array<any> = [];
  categories: Array<any> = [];
  userData: any = {};
  submitted: boolean = false;
  selectedIndex: number = 0;
  images = new Array<ProductImages>();

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
  };

  fieldArray: Array<any> = [
    {
      imageUrl: '',
    },
  ];
  newAttribute: any = {};
  firstField = true;
  firstFieldName = '';
  variationsDisabled: boolean;
  inventoryId: number = 0;
  sub: any;
  product: any = {};
  isUploaded: boolean = false;
  productImages: Array<any> = [];
  @ViewChild('file') file: ElementRef;
  companyId: any;
  attributes: Array<any> = [];
  customInventory: Array<any> = [];
  filteredBrands: Observable<any>;
  filteredSuppliers: Observable<any>;
  filteredCategories: Observable<any>;
  filteredConditions: Observable<any>;
  isResetBrand = false;
  isResetCategory: boolean;
  isResetCondition: boolean;
  isResetSupplier: boolean;
  primaryImage: number;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private inventoryService: InventoryService,
    private commonService: CommonService,
    private route: ActivatedRoute
  ) {
    this.initializeFormControls();
  }

  ngOnInit(): void {
    this.userData = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    this.getSuppliers();
    this.getBrands();
    this.getConditions();
    this.getCategories();
    this.readQuery();
    this.getCustomAttributes();
    if (this.inventoryId) {
      this.getProductById();
    }
  }

  //Initialize form controls
  private initializeFormControls() {
    this.productForm = this.formBuilder.group({
      inventoryId: [0],
      title: ['', Validators.required],
      initialCostPrice: [0],
      retailPrice: [0],
      sellingPrice: [0],
      buyItNowPrice: [0],
      asin: [''],
      sku: ['', Validators.required],
      upc: [''],
      ean: [''],
      quantity: [1],
      lowStock: [0],
      mpn: [''],
      isbn: [''],
      categoryId: [null],
      conditionId: [null],
      description: [''],
      notes: [''],
      brandId: [null],
      supplierId: [null],
      dimentionUnits: [''],
      length: [0],
      width: [0],
      height: [0],
      weight: [0],
      weightUnit: [''],
      brandName: [''],
      supplierName: [''],
      conditionName: [''],
      categoryName: [''],
      customAttributes: this.formBuilder.array([]),
      // variationsForm: this.formBuilder.group({
      //   inventoryVariationId: [0],
      //   varationTitle: [""],
      // })
    });
  }

  private getFilteredBrands() {
    this.filteredBrands = this.productForm.get('brandName').valueChanges.pipe(
      startWith(''),
      map((item) => (item ? this._filterBrands(item) : this.brands.slice()))
    );
  }

  private _filterBrands(value) {
    this.isResetBrand = true;
    const filterValue = value.toLowerCase();
    return this.brands.filter(
      (option) => option.brandName.toLowerCase().indexOf(filterValue) === 0
    );
  }

  displayBrand(name) {
    if (name == undefined || name === '') this.isResetBrand = false;
    return name ? name : '';
  }

  resetAuto(name) {
    if (name === 'brand') {
      this.isResetBrand = false;
      this.productForm.get('brandName').setValue('');
    } else if (name === 'category') {
      this.isResetCategory = false;
      this.productForm.get('categoryName').setValue('');
    } else if (name === 'condition') {
      this.isResetCondition = false;
      this.productForm.get('conditionName').setValue('');
    } else if (name === 'supplier') {
      this.isResetSupplier = false;
      this.productForm.get('supplierName').setValue('');
    }
  }

  private getFilteredSuppliers() {
    this.filteredSuppliers = this.productForm
      .get('supplierName')
      .valueChanges.pipe(
        startWith(''),
        map((item) =>
          item ? this._filterSuppliers(item) : this.suppliers.slice()
        )
      );
  }

  private _filterSuppliers(value) {
    this.isResetSupplier = true;
    const filterValue = value.toLowerCase();
    return this.suppliers.filter(
      (option) => option.firstName.toLowerCase().indexOf(filterValue) === 0
    );
  }

  displaySupplier(name) {
    if (name == undefined || name === '') this.isResetSupplier = false;
    return name ? name : '';
  }

  private getFilteredCategories() {
    this.filteredCategories = this.productForm
      .get('categoryName')
      .valueChanges.pipe(
        startWith(''),
        map((item) =>
          item ? this._filterCategories(item) : this.categories.slice()
        )
      );
  }

  private _filterCategories(value) {
    this.isResetCategory = true;
    const filterValue = value.toLowerCase();
    return this.categories.filter(
      (option) => option.categoryName.toLowerCase().indexOf(filterValue) === 0
    );
  }

  displayCategory(name) {
    if (name == undefined || name === '') this.isResetCategory = false;
    return name ? name : '';
  }
  private getFilteredConditions() {
    this.filteredConditions = this.productForm
      .get('conditionName')
      .valueChanges.pipe(
        startWith(''),
        map((item) =>
          item ? this._filterConditions(item) : this.conditions.slice()
        )
      );
  }

  private _filterConditions(value) {
    this.isResetCondition = true;
    const filterValue = value.toLowerCase();
    return this.conditions.filter(
      (option) =>
        option.eBayConditionName.toLowerCase().indexOf(filterValue) === 0
    );
  }

  displayCondition(name) {
    if (name == undefined || name === '') this.isResetCondition = false;
    return name ? name : '';
  }

  get customAttributes(): FormArray {
    return this.productForm.get('customAttributes') as FormArray;
  }

  checkSKU(e) {
    this.inventoryService
      .checkProductSKUExist(
        this.inventoryId ? this.inventoryId : 0,
        e.target.value,
        this.userData.companyId
      )
      .subscribe(
        (response) => {
          if (response !== null && response.body.status == 200) {
            if (response.body.data == true) {
              this.notificationService.Error(
                'SKU exist, please try different.'
              );
              this.productForm.get('sku').setValue('');
            }
          }
        },
        (error) => {
          this.notificationService.Error(error.message);
        }
      );
  }

  //To add attribute
  addAttribute(item): FormGroup {
    return this.formBuilder.group({
      inventoryCustomFieldId: new FormControl(item.inventoryCustomFieldId),
      inventoryId: new FormControl(item.inventoryId),
      customAttributeId: new FormControl(item.customAttributeId),
      customAttributeName: new FormControl(item.customAttributeName),
      customAttributeValue: new FormControl(item.customAttributeValue),
    });
  }

  //Tp remove attribute
  removeAttribute(index, control) {
    this.inventoryService
      .deleteCustomAttribute(control.value.customAttributeId)
      .subscribe(
        (response) => {
          if (response !== null && response.body.status == 200) {
            this.customAttributes.removeAt(index);
            this.notificationService.Success(response.body.message);
          } else {
            this.notificationService.Error(response.body.message);
          }
        },
        (error) => {
          this.notificationService.Error(error.message);
        }
      );
  }

  //To get attributes
  getCustomAttributes() {
    this.inventoryService
      .getCustomAttributes(this.userData.companyId)
      .subscribe(
        (response) => {
          if (response !== null && response.body.data !== null) {
            this.attributes = response.body.data;
            if (this.inventoryId == undefined || this.inventoryId <= 0) {
              //save case
              this.attributes.forEach((item) => {
                item.customAttributeValue = '';
                this.customAttributes.push(this.addAttribute(item));
              });
            }
          } else {
          }
        },
        (error) => {
          console.log('this.error', error);
        }
      );
  }

  //To get product by id
  getProductById() {
    this.inventoryService.getProductById(this.inventoryId).subscribe(
      (response) => {
        if (response != null && response.body.data !== null) {
          this.product = response.body.data.inventory;
          this.companyId = this.product.companyId;
          this.productImages = response.body.data.inventoryImages;
          this.images = this.productImages;
          this.customInventory = response.body.data.customInventoryDetails;
          if (this.customInventory.length > 0) {
            this.attributes.forEach((item) => {
              let itemInventory = this.customInventory.find(
                (x) => x.customAttributeKey === item.customAttributeName
              );
              if (itemInventory) {
                let customItem = {
                  inventoryCustomFieldId: itemInventory.inventoryCustomFieldId,
                  inventoryId: itemInventory.inventoryId,
                  customAttributeId: itemInventory.customAttributeId,
                  customAttributeName: itemInventory.customAttributeKey,
                  customAttributeValue: itemInventory.customAttributeValue,
                };
                this.customAttributes.push(this.addAttribute(customItem));
              } else {
                item.customAttributeValue = '';
                this.customAttributes.push(this.addAttribute(item));
              }
            });
          } else {
            this.attributes.forEach((item) => {
              item.customAttributeValue = '';
              this.customAttributes.push(this.addAttribute(item));
            });
          }

          this.productForm.patchValue(this.product);
          this.productForm
            .get('brandName')
            .setValue(
              this.product.brandId
                ? this.brands.find((x) => x.brandId == this.product.brandId)
                    .brandName
                : ''
            );
          this.productForm
            .get('categoryName')
            .setValue(
              this.product.categoryId
                ? this.categories.find(
                    (x) => x.categoryId == this.product.categoryId
                  ).categoryName
                : ''
            );
          this.productForm
            .get('conditionName')
            .setValue(
              this.product.conditionId
                ? this.conditions.find(
                    (x) => x.conditionId == this.product.conditionId
                  ).eBayConditionName
                : ''
            );
          this.productForm
            .get('supplierName')
            .setValue(
              this.product.supplierId
                ? this.suppliers.find(
                    (x) => x.supplierId == this.product.supplierId
                  ).fullName
                : ''
            );
        } else {
          console.log('this.message', response.body.message);
        }
      },
      (error) => {
        console.log('this.error', error);
      }
    );
  }

  //To read query string values
  private readQuery() {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.inventoryId = params['productId'];
    });
  }

  public nextStep() {
    this.selectedIndex += 1;
  }

  previousStep() {
    this.selectedIndex -= 1;
  }

  showVariationsOptions(e) {
    if (e.checked) {
      this.variationsDisabled = false;
    } else this.variationsDisabled = true;
  }

  handleFileChange(event) {
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        if (this.commonService.isValidFileType(file.name, 'image')) {
          let img = {
            inventoryId: 0,
            inventoryImageId: 0,
            imageUrl: '',
            fileName: file.name,
            size: file.size,
            progress: '100%',
            status: 'Done',
            isPrimaryImage: false,
          };
          let reader = new FileReader();
          reader.onload = (e) => {
            (img.imageUrl = e.target.result.toString()), this.images.push(img);
            this.isUploaded = true;
          };
          reader.readAsDataURL(file);
        } else this.notificationService.Error('Please select valid file type');
      }
    }
  }

  removeImage(fileName) {
    this.images = this.images.filter((item) => item.fileName != fileName);
  }

  primaryImageChange(e) {
    e.isPrimaryImage = true;
    if (e.inventoryImageId && e.inventoryImageId > 0) {
      let postData = {
        inventoryId: e.inventoryId,
        inventoryImageId: e.inventoryImageId,
        isPrimaryImage: e.isPrimaryImage,
      };
      this.inventoryService.addProductImageAsPrimary(postData).subscribe(
        (response) => {
          if (response.body.status == 200) {
            this.notificationService.Success(response.body.message);
          } else {
            this.notificationService.Error(response.body.message);
          }
        },
        (error) => {
          this.notificationService.Error(
            'Something went wrong, please try again later.'
          );
        }
      );
    }
  }

  //To upload images
  uploadAll() {
    if (this.inventoryId > 0 && this.images.length > 0 && this.isUploaded) {
      let postData = {
        InventoryImages: this.images.filter((x) => x.inventoryImageId == 0),
        inventoryId: +this.inventoryId,
        companyId: this.companyId,
      };

      this.inventoryService.uploadProductImages(postData).subscribe(
        (response) => {
          if (response != null && response.body.status == 200) {
            this.images = response.body.data;
            this.notificationService.Success(response.body.message);
            this.isUploaded = false;
            this.file.nativeElement.value = '';
          } else {
            console.log('this.message', response.body.message);
          }
        },
        (error) => {
          console.log('this.error', error);
          this.notificationService.Error(
            'Something went wrong. Please try again later.'
          );
        }
      );
    } else this.notificationService.Error('Please select file first.');
  }

  //To remove images
  removeAll() {
    this.isUploaded = false;
    if (this.inventoryId > 0 && this.images.length > 0) {
      let postData = {
        inventoryId: this.inventoryId,
        isDeleteAll: true,
      };
      this.deleteProductImage(postData);
    }
    this.file.nativeElement.value = '';
    this.images = [];
  }

  //To cancel images
  cancelAll() {
    this.isUploaded = false;
    this.images = this.images.filter((item) => item.inventoryImageId !== 0);
    this.file.nativeElement.value = '';
  }

  //To delete images
  deleteProductImage(item) {
    let imgs = [];
    if (this.inventoryId > 0 && item.inventoryImageId != 0) {
      let postData = item;
      postData.inventoryId = parseInt(postData.inventoryId);
      this.inventoryService.deleteProductImages(postData).subscribe(
        (response) => {
          if (response != null && response.body.status == 200) {
            this.notificationService.Success(response.body.message);
            if (!item.isDeletedAll) {
              this.images.forEach((element) => {
                if (element.fileName !== item.fileName) {
                  imgs.push(element);
                }
              });
              this.images = imgs;
            }
          } else {
            console.log('this.message', response.body.message);
          }
        },
        (error) => {
          this.notificationService.Error(error.message);
        }
      );
    } else {
      this.images.forEach((element) => {
        if (element.fileName !== item.fileName) {
          imgs.push(element);
        }
      });
      this.images = imgs;
      this.file.nativeElement.value = '';
    }
  }

  addFieldValue() {
    if (this.fieldArray.length <= 30) {
      this.fieldArray.push(this.newAttribute);
      this.newAttribute = {};
    } else {
    }
  }

  deleteFieldValue(index) {
    this.fieldArray.splice(index, 1);
  }

  //Get from controls
  get formControls() {
    return this.productForm.controls;
  }

  //To get suppliers
  getSuppliers() {
    this.inventoryService.getSuppliers(this.userData.companyId).subscribe(
      (response) => {
        if (response.body.data !== null) {
          this.suppliers = response.body.data;
          this.getFilteredSuppliers();
        } else {
          console.log('this.message', response.body.message);
        }
      },
      (error) => {
        console.log('this.error', error);
      }
    );
  }

  //To get brands
  getBrands() {
    this.inventoryService.getBrands(this.userData.companyId).subscribe(
      (response) => {
        if (response.body.data !== null) {
          this.brands = response.body.data;
          this.getFilteredBrands();
        } else {
          console.log('this.message', response.body.message);
        }
      },
      (error) => {
        console.log('this.error', error);
      }
    );
  }

  //To get conditions
  getConditions() {
    this.inventoryService.getConditions().subscribe(
      (response) => {
        if (response.body.data !== null) {
          this.conditions = response.body.data;
          this.getFilteredConditions();
        } else {
          console.log('this.message', response.body.message);
        }
      },
      (error) => {
        console.log('this.error', error);
      }
    );
  }

  //To get categories
  getCategories() {
    this.inventoryService.getCategories(this.userData.companyId).subscribe(
      (response) => {
        if (response.body.data !== null) {
          this.categories = response.body.data;
          this.getFilteredCategories();
        } else {
          console.log('this.message', response.body.message);
        }
      },
      (error) => {
        console.log('this.error', error);
      }
    );
  }

  onSubmit() {
    if (this.productForm.invalid) {
      return;
    }
    this.submitted = true;
    let customInventory = [];
    this.productForm.value.customAttributes.forEach((element) => {
      let item = {
        customAttributeKey: element.customAttributeName,
        customAttributeValue: element.customAttributeValue,
      };
      customInventory.push(item);
    });

    let postData = {
      inventory: this.productForm.value,
      inventoryImages: this.images,
      inventoryVariations: [],
      inventoryVariationAttributes: [],
      customInventoryDetails: customInventory,
    };
    postData.inventory.companyId = this.userData.companyId;
    if (this.inventoryId > 0) {
      this.inventoryService.updateProduct(postData).subscribe(
        (response) => {
          if (response != null && response.body.status === 200) {
            this.notificationService.Success(response.body.message);
            this.router.navigate(['./inventory/products']);
          } else {
            this.notificationService.Error(response.body.message);
          }
        },
        (error) => {
          this.submitted = false;
          this.notificationService.Error(error.error.title);
        }
      );
    } else {
      this.inventoryService.createProduct(postData).subscribe(
        (response) => {
          if (response != null && response.body.status === 200) {
            this.notificationService.Success(response.body.message);
            this.router.navigate(['./inventory/products']);
          } else {
            this.notificationService.Error(response.body.message);
          }
        },
        (error) => {
          this.submitted = false;
          this.notificationService.Error(error.error.title);
        }
      );
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CustomAttributeComponent, {
      width: '500px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result.event == 'Add') {
        this.customAttributes.push(this.addAttribute(result.data));
      }
    });
  }

  deleteAttributeConfirm(index, control) {
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
        this.removeAttribute(index, control);
      }
    });
  }
}
