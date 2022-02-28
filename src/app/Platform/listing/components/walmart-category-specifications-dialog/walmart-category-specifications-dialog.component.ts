import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { ActivatedRoute } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { CustomAttribute } from '../../models/CustomAttribute';
import { WalmartListingService } from '../../services/walmart-listing.service';

@Component({
  selector: 'app-walmart-category-specifications-dialog',
  templateUrl: './walmart-category-specifications-dialog.component.html',
  styleUrls: ['./walmart-category-specifications-dialog.component.scss']
})

export class WalmartCategorySpecificationsDialogComponent implements OnInit {
  walmartCategoryFormGroup: FormGroup;
  primaryCategory: string = '';
  subCategorySelectedIndex: number = 0;
  walmartCommonContentProperties: Array<any> = [];
  customAttributes: Array<CustomAttribute> = [];
  customAttributesFilter: Array<any> = [];
  walmartPropertyNameList: Array<any> = [];
  walmartSuggestedValues: Array<any> = [];
  userData: any = {};
  inventoryId: any;
  aspectType: any;
  submitted: boolean;
  userMarketplace: any = {};
  inventoryIds: any;
  walmartMasterCategories: any;
  walmartMasterSubCategories: Array<any> = [];
  walmartMasterSubCategoryProperties: Array<any> = [];
  subCategoryAttributeFormArray: FormArray;
  propertyChildAttributes: Array<any> = [];
  commonContentSuggestedValues: Array<any> = [];
  walmartCommons: Array<any> = [];

  constructor(public dialogRef: MatDialogRef<WalmartCategorySpecificationsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private listingService: ListingService, private notificationService: NotificationService, private walmartListingService: WalmartListingService, private route: ActivatedRoute) {
    this.inventoryId = data.inventoryId;
    this.inventoryIds = data.inventoryIds;
    this.userMarketplace = data.userMarketplace;

  }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('currentUser')?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser'));
    this.walmartCategoryFormGroup = this.formBuilder.group({
      walmartMasterCategoryId: ['', Validators.required],
      walmartMasterSubCategoryId: ['', Validators.required],
      walmartSubCatPropertiesArray: this.formBuilder.array([this.createWalmartSubCategoryAtttribute()]),

    });
    //get Walmart master categories
    this.getWalmartMasterCategories();
    this.getWalmartCommonContentProperties();
  }

  //Get form controls
  get formControls() {
    return this.walmartCategoryFormGroup.controls;
  }

  getWalmartMasterCategories() {
    this.walmartListingService.getWalmartMasterCategories().subscribe(response => {
      if (response.body.status == 200) {
        this.walmartMasterCategories = response.body.data;
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error("Something went wrong, please try again later.");
    });
  }

  handleCategoryChange(event) {
    if (event.value) {
      let categoryID = event.value;
      this.walmartListingService.getWalmartMasterSubCategories(categoryID).subscribe(response => {
        if (response.body.status == 200) {
          this.walmartMasterSubCategories = response.body.data;
          this.subCategorySelectedIndex = 0;
        }
        else {
          this.notificationService.Error(response.body.message);
        }
      }, error => {
        this.notificationService.Error("Something went wrong, please try again later.");
      });
    }
  }

  handleSubCategoryChange(event) {
    if (event.value) {
      this.getWalmartMasterSubCategoryProperties(event.value);
      this.subCategorySelectedIndex = 1;
      if (this.subCategoryAttributeFormArray) {
        this.subCategoryAttributeFormArray.clear();
        this.subCategoryAttributeFormArray.push(this.createWalmartSubCategoryAtttribute());
      }
    }
  }

  private getWalmartMasterSubCategoryProperties(subcategoryID: number) {
    this.walmartListingService.getWalmartMasterSubCategoryProperties(subcategoryID).subscribe(response => {
      if (response.body.status == 200) {
        this.walmartMasterSubCategoryProperties = response.body.data;
        this.walmartPropertyNameList = this.walmartMasterSubCategoryProperties.map(x => x.propertyName);
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error("Something went wrong, please try again later.");
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.walmartCategoryFormGroup.invalid) {
      return;
    }

    this.submitted = true;
    let postData = this.walmartCategoryFormGroup.value;
    postData.companyId = this.userData.companyId;
    if (this.inventoryId != undefined) {
      postData.inventoryId = this.inventoryId;
      postData.inventoryIds = null;
    }
    else {
      postData.inventoryIds = this.inventoryIds;
      postData.inventoryId = null;
    }
    postData.userMarketplaceId = this.userMarketplace.userMarketplaceId;
    postData.userMarketplaceSiteId = this.userMarketplace.userMarketplaceSiteMapId;

    this.walmartListingService.saveWalmartProductCategorySpecs(postData).subscribe(response => {
      if (response.body.status === 200) {
        this.notificationService.Success(response.body.message);
        this.dialogRef.close();
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      console.log('error log', error.message)
      this.notificationService.Error("Something went wrong, please try again later.");
    });

  }

  get getSubCategoryAttributesControls() {
    this.subCategoryAttributeFormArray = this.walmartCategoryFormGroup.get('walmartSubCatPropertiesArray') as FormArray;
    return this.subCategoryAttributeFormArray;
  }

  createWalmartSubCategoryAtttribute(d?: any): FormGroup {
    return this.formBuilder.group({
      propertyMapId: [d && d.propertyMapId ? d.propertyMapId : 0],
      propertyName: [d && d.propertyName ? d.propertyName : null, Validators.compose([Validators.required])],
      propertyValue: [d && d.propertyValue ? d.propertyValue : null],
      propertyChildProperties: this.formBuilder.array([]),
    });

  }

  //Create Property Child Properties
  createPropertyChildProperties(d, i, key) {
    let formArray = this.subCategoryAttributeFormArray.controls[i].get("propertyChildProperties") as FormArray;
    formArray.push(this.formBuilder.group({
      propertyMapId: [d && d.propertyMapId ? d.propertyMapId : 0],
      propertyName: [d && d.propertyName ? d.propertyName : null, Validators.compose([Validators.required])],
      propertyValue: [d && d.propertyValue ? d.propertyValue : null],
    }));
    this.commonContentSuggestedValues[key] = d ? d.walmartSuggestedValues : [];
  }

  addAttribute() {
    if (this.subCategoryAttributeFormArray.length < this.walmartPropertyNameList.length)
      this.subCategoryAttributeFormArray.push(this.createWalmartSubCategoryAtttribute());
    else
      this.notificationService.Error("Product attribute limit reached.");

  }

  deleteAttribute(index) {
    let value = this.subCategoryAttributeFormArray.value[index].productTypeAttributeName
    this.subCategoryAttributeFormArray.removeAt(index);

  }

  addSubAttribute(control, parentindex, index) {
    let data = control.value;
    this.createPropertyChildProperties(data, parentindex, index);
  }

  deleteSubAttribute(parentindex, index) {
    let formArray = this.subCategoryAttributeFormArray.controls[parentindex].get("propertyChildProperties") as FormArray;
    formArray.removeAt(index);
  }


  handlePropertyNameChange(event, index) {
    let propertyName = this.subCategoryAttributeFormArray.value.filter(c => c.propertyName == event.value);
    if (propertyName.length > 1) {
      this.notificationService.Error("Attribute already added. Please select different.");
    }
    let walmartProperty = this.walmartMasterSubCategoryProperties.find(c => c.propertyName == event.value);
    if (walmartProperty) {
      this.walmartSuggestedValues[index] = walmartProperty.walmartSuggestedValues;
    }
    //Check if common property type exists
    this.propertyChildAttributes[index] = [];
    let contentCommon = this.walmartCommonContentProperties.find(c => c.complexTypeName == walmartProperty.propertyType);
    if (contentCommon) {
      let contentProperties = [];
      let suggestedValues = [];
      contentCommon.walmartMasterContentCommonsProperties.forEach(element => {
        let props = contentCommon.walmartMasterContentCommonsProperties.filter(c => c.propertyName === element.propertyName);
        if (!contentProperties.some(c => c.propertyName === element.propertyName)) {
          suggestedValues = []
          props.forEach(e => {
            if (e.propertyValue != null && e.propertyValue != '') {
              suggestedValues.push(e.propertyValue)
            }
          });
          element.walmartSuggestedValues = suggestedValues;
          contentProperties.push(element);
        }

      });

      this.propertyChildAttributes[index] = contentProperties;
      let formArray = this.subCategoryAttributeFormArray.controls[index].get("propertyChildProperties") as FormArray;
      formArray.clear();
      this.propertyChildAttributes[index].forEach((item, key) => {
        this.createPropertyChildProperties(item, index, key);
      });
    }
  }

  getWalmartCommonContentProperties() {
    this.walmartListingService.getWalmartCommonContentProperties().subscribe(response => {
      if (response.body.status == 200) {
        this.walmartCommonContentProperties = response.body.data;

      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error("Something went wrong, please try again later.");
    });
  }

  getPropertyChildControls(form) {
    return form.controls.propertyChildProperties.controls;
  }

}
