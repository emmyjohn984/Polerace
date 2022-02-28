import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { ActivatedRoute } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { CustomAttribute } from '../../models/CustomAttribute';
import { InventoryService } from 'src/app/Platform/inventory/services/inventory.service';

@Component({
  selector: 'app-ebay-category-specifications-dialog',
  templateUrl: './ebay-category-specifications-dialog.component.html',
  styleUrls: ['./ebay-category-specifications-dialog.component.scss'],
})
export class EbayCategorySpecificationsDialogComponent implements OnInit {
  setupeBayFormGroup: FormGroup;
  //customAttributesForm:FormGroup;
  primaryCategory: string = '';
  categoryId: number = 0;
  selectedIndex: number = 0;
  eBayCategories: Array<any> = [];
  eBayCategoryLevel1Categories: Array<any> = [];
  eBayCategoryLevel2Categories: Array<any> = [];
  eBayCategoryLevel3Categories: Array<any> = [];
  eBayCategoryLevel5Categories: Array<any> = [];
  eBayCategoryLevel4Categories: Array<any> = [];
  eBayListingDuration: Array<any> = [];
  eBayListingStyle: Array<any> = [];
  eBayCategoryAspects: Array<any> = [];
  customAttributes: Array<CustomAttribute> = [];
  customAttributesFilter: Array<any> = [];
  customInventoryAttributes: Array<any> = [];
  specificationsValues: Array<any> = [];
  userData: any = {};
  inventoryId: any;
  aspectType: any;
  submitted: boolean;
  userMarketplace: any = {};
  eBayListingProfile: any;
  eBayListingCondition: Array<any> = [];
  eBayListingDurationFiltered: Array<any> = [];
  customAttrIndexesForEdit: Array<any> = [];
  inventoryIds: Array<any> = [];
  product: any;
  constructor(
    public dialogRef: MatDialogRef<EbayCategorySpecificationsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private listingService: ListingService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private inventoryService: InventoryService
  ) {
    this.geteBayCategoryByCategoryId(this.categoryId);
    this.geteBayListingDuration();
    this.geteBayListingStyle();
    this.geteBayListingCondition();
    this.inventoryId = data.inventoryId;
    this.inventoryIds = data.inventoryIds;
    this.userMarketplace = data.userMarketplace;
  }

  ngOnInit(): void {
    this.setupeBayFormGroup = this.formBuilder.group({
      listingProfileId: [0],
      parentCategoryId: ['', Validators.required],
      categoryLevel1: [''],
      categoryLevel2: [''],
      categoryLevel3: [''],
      categoryLevel4: [''],
      categoryLevel5: [''],
      listingStyle: ['', Validators.required],
      listingDuration: ['', Validators.required],
      conditionTypeId: ['', Validators.required],
      description: [''],
      customAttributes: this.formBuilder.array([]),
    });
    this.userData = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    if (this.inventoryId != undefined) this.geteBayListingProfile();
  }

  //To get product by id
  getProductById() {
    this.inventoryService.getProductById(this.inventoryId).subscribe(
      (response) => {
        if (response != null && response.body.status == 200) {
          this.product = response.body.data.inventory;
          let condition = this.eBayListingCondition.find(
            (c) => c.value == this.product.eBayConditionValue
          );
          if (condition) {
            this.setupeBayFormGroup
              .get('conditionTypeId')
              .setValue(condition.value);
          }
          this.setupeBayFormGroup
            .get('parentCategoryId')
            .setValue(this.product.eBayCategoryID);
        }
      },
      (error) => {
        console.log('this.error', error);
      }
    );
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  public nextStep() {
    this.selectedIndex += 1;
  }

  previousStep() {
    this.selectedIndex -= 1;
  }

  //Get from controls
  get formControls() {
    return this.setupeBayFormGroup.controls;
  }
  get getArrayControls() {
    return this.setupeBayFormGroup.get('customAttributes') as FormArray;
  }

  handleParentCategoryChange(event) {
    this.listingService.geteBayCategoryByCategoryId(event.value).subscribe(
      (response) => {
        if (response.body.status == 200) {
          this.eBayCategoryLevel2Categories = [];
          this.eBayCategoryLevel3Categories = [];
          this.eBayCategoryLevel4Categories = [];
          this.eBayCategoryLevel5Categories = [];
          this.eBayCategoryAspects = [];
          this.eBayCategoryLevel1Categories = response.body.data;
          var isLeafNode = this.eBayCategories.find(
            (c) => c.categoryId == event.value
          ).leafCategoryTreeNode;
          if (isLeafNode == true) this.geteBayCategoryAspects(event.value);
        } else {
          this.notificationService.Error(response.body.message);
        }
      },
      (error) => {
        this.notificationService.Error(error.message);
      }
    );
  }

  handleParentCategoryLevel1Change(event) {
    this.listingService.geteBayCategoryByCategoryId(event.value).subscribe(
      (response) => {
        if (response.body.status == 200) {
          this.eBayCategoryLevel3Categories = [];
          this.eBayCategoryLevel4Categories = [];
          this.eBayCategoryLevel5Categories = [];
          this.eBayCategoryAspects = [];
          this.eBayCategoryLevel2Categories = response.body.data;
          var isLeafNode = this.eBayCategoryLevel1Categories.find(
            (c) => c.categoryId == event.value
          ).leafCategoryTreeNode;
          if (isLeafNode == true) this.geteBayCategoryAspects(event.value);
        } else {
          this.notificationService.Error(response.body.message);
        }
      },
      (error) => {
        this.notificationService.Error(error.message);
      }
    );
  }

  handleParentCategoryLevel2Change(event) {
    this.listingService.geteBayCategoryByCategoryId(event.value).subscribe(
      (response) => {
        if (response.body.status == 200) {
          this.eBayCategoryLevel4Categories = [];
          this.eBayCategoryLevel5Categories = [];
          this.eBayCategoryAspects = [];
          this.eBayCategoryLevel3Categories = response.body.data;
          var isLeafNode = this.eBayCategoryLevel2Categories.find(
            (c) => c.categoryId == event.value
          ).leafCategoryTreeNode;
          if (isLeafNode == true) this.geteBayCategoryAspects(event.value);
        } else {
          this.notificationService.Error(response.body.message);
        }
      },
      (error) => {
        this.notificationService.Error(error.message);
      }
    );
  }

  handleParentCategoryLevel3Change(event) {
    this.listingService.geteBayCategoryByCategoryId(event.value).subscribe(
      (response) => {
        if (response.body.status == 200) {
          this.eBayCategoryLevel5Categories = [];
          this.eBayCategoryAspects = [];
          this.eBayCategoryLevel4Categories = response.body.data;
          var isLeafNode = this.eBayCategoryLevel3Categories.find(
            (c) => c.categoryId == event.value
          ).leafCategoryTreeNode;
          if (isLeafNode == true) this.geteBayCategoryAspects(event.value);
        } else {
          this.notificationService.Error(response.body.message);
        }
      },
      (error) => {
        this.notificationService.Error(error.message);
      }
    );
  }

  handleParentCategoryLevel4Change(event) {
    this.listingService.geteBayCategoryByCategoryId(event.value).subscribe(
      (response) => {
        if (response.body.status == 200) {
          this.eBayCategoryLevel5Categories = response.body.data;
          var isLeafNode = this.eBayCategoryLevel4Categories.find(
            (c) => c.categoryId == event.value
          ).leafCategoryTreeNode;
          if (isLeafNode == true) this.geteBayCategoryAspects(event.value);
        } else {
          this.notificationService.Error(response.body.message);
        }
      },
      (error) => {
        this.notificationService.Error(error.message);
      }
    );
  }

  handleParentCategoryLevel5Change(event) {
    this.listingService.geteBayCategoryByCategoryId(event.value).subscribe(
      (response) => {
        if (response.body.status == 200) {
          this.eBayCategoryLevel5Categories = response.body.data;
          var isLeafNode = this.eBayCategoryLevel5Categories.find(
            (c) => c.categoryId == event.value
          ).leafCategoryTreeNode;
          if (isLeafNode == true) this.geteBayCategoryAspects(event.value);
        } else {
          this.notificationService.Error(response.body.message);
        }
      },
      (error) => {
        this.notificationService.Error(error.message);
      }
    );
  }

  // To get eBay categories
  geteBayCategoryByCategoryId(categoryId) {
    this.listingService.geteBayCategoryByCategoryId(categoryId).subscribe(
      (response) => {
        if (response.body.status == 200) {
          this.eBayCategories = response.body.data;
        } else {
          this.notificationService.Error(response.body.message);
        }
      },
      (error) => {
        this.notificationService.Error(error.message);
      }
    );
  }

  // To get eBay aspects
  geteBayCategoryAspects(categoryId) {
    this.customAttributes = [];

    this.getCustomAttributes();
    setTimeout(() => {
      this.listingService.geteBayCategoryAspects(categoryId).subscribe(
        (response) => {
          if (response.body.status == 200) {
            this.eBayCategoryAspects = response.body.data;

            this.eBayCategoryAspects.forEach((item, key) => {
              if (item.localizedValues) {
                for (var i = 0; i < item.localizedValues.length; i++) {
                  let attribute = {
                    value: item.localizedValues[i],
                    text: item.localizedValues[i],
                    aspectName: item.localizedAspectName,
                    aspectType: 'eBay',
                  };
                  this.customAttributes.push(attribute);
                }
                if (this.eBayListingProfile != undefined) {
                  if (
                    this.eBayListingProfile.eBayListingProfileItemSpecifics !=
                    undefined
                  )
                    var t = this.fillValuesInEditMode(item);
                  if (t !== undefined) {
                    var event = { value: t.aspectType };
                    this.handleSpecificationsChange(event, key, t.aspectName);
                    var event1 = { value: t.value };
                    // debugger;
                    this.handleSpecificationsValueChange(
                      event1,
                      key,
                      t.aspectName,
                      t.id
                    );
                    //  this.customAttributesForm =
                    if (this.aspectType == '') {
                      debugger;
                    }
                    const formtest = new FormGroup({
                      id: new FormControl(t.aspectType),
                      pass: new FormControl(t.value),
                    });
                    this.getArrayControls.push(formtest);
                  } else {
                    // this.customAttributesForm =
                    const formtest = new FormGroup({
                      id: new FormControl(''),
                      pass: new FormControl(''),
                    });
                    this.getArrayControls.push(formtest);
                    // this.getArrayControls.push(this.formBuilder.group({
                    //   'id': ["CustomAttributes"],
                    //    'pass': [""]
                    //   }));
                  }
                } else {
                  this.customAttrIndexesForEdit = [];
                  const formtest = new FormGroup({
                    id: new FormControl(''),
                    pass: new FormControl(''),
                  });
                  this.getArrayControls.push(formtest);
                }
              }
            });

            //this.getArrayControls.controls[0].patchValue({id:"eBayRecommended",pass:""});
          } else {
            this.notificationService.Error(response.body.message);
          }
        },
        (error) => {
          this.notificationService.Error(error.message);
        }
      );
    }, 200);
  }
  fillValuesInEditMode(item: any) {
    var listingspecifics = this.eBayListingProfile.eBayListingProfileItemSpecifics.filter(
      (c) => c.aspectName == item.localizedAspectName
    );
    if (listingspecifics.length > 0) {
      var customAttribute = { value: listingspecifics[0].asp };
      var customAttr = {
        value: listingspecifics[0].aspectValue,
        text: null,
        aspectName: listingspecifics[0].aspectName,
        aspectType: listingspecifics[0].aspectType,
        id: listingspecifics[0].listingProfileItemSpecificsId,
      };
      return customAttr;
    } else {
      // if(this.eBayListingProfile.eBayListingProfileItemSpecifics.length>0){
      //   this.eBayListingProfile.eBayListingProfileItemSpecifics.forEach((ebaylistingprofileItemSpecific) => {
      //    if(item.localizedAspectName == ebaylistingprofileItemSpecific.aspectName){
      //     // var event = {value:ebaylistingprofileItemSpecific.aspectType};
      //    //  this.handleSpecificationsChange(event,i,ebaylistingprofileItemSpecific.aspectName);

      //     //  this.customAttrVal.push(customAttr);
      //     return customAttr;

      //    }

      // });
      return undefined;
    }
  }

  // To get eBay ListingDuration
  geteBayListingDuration() {
    this.listingService.geteBayListingDuration().subscribe(
      (response) => {
        if (response != null && response.body.status == 200) {
          this.eBayListingDuration = response.body.data;
          this.eBayListingDurationFiltered = this.eBayListingDuration;
        } else {
          this.notificationService.Error(response.body.message);
        }
      },
      (error) => {
        this.notificationService.Error(error.message);
      }
    );
  }

  // To eBay ListingStyle
  geteBayListingStyle() {
    this.listingService.geteBayListingStyle().subscribe(
      (response) => {
        if (response != null && response.body.status == 200) {
          this.eBayListingStyle = response.body.data;
        } else {
          this.notificationService.Error(response.body.message);
        }
      },
      (error) => {
        this.notificationService.Error(error.message);
      }
    );
  }

  // To eBay ListingCondition
  geteBayListingCondition() {
    this.listingService.geteBayCondition().subscribe(
      (response) => {
        if (response != null && response.body.status == 200) {
          this.eBayListingCondition = response.body.data;
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
    this.listingService
      .getCustomAttributesByCompanyId(this.userData.companyId)
      .subscribe(
        (response) => {
          if (response != null && response.body.status == 200) {
            this.customInventoryAttributes = response.body.data;
            this.customInventoryAttributes.forEach((item) => {
              let attribute = {
                value: item.customAttributeValue,
                text: item.customAttributeName,
                customFieldId: item.customAttributeId,
                aspectName: 'custom',
                aspectType: 'custom',
              };
              this.customAttributes.push(attribute);
            });
          } else {
            //this.notificationService.Error(response.body.message);
          }
        },
        (error) => {
          this.notificationService.Error(error.message);
        }
      );
  }

  // To eBay ListingProfile
  geteBayListingProfile() {
    this.listingService
      .geteBayListingProfile(this.inventoryId, this.userData.companyId)
      .subscribe(
        (response) => {
          if (
            response != null &&
            response.body.data &&
            response.body.status == 200
          ) {
            this.eBayListingProfile = response.body.data;
            let categoryArray = this.eBayListingProfile.primaryCategory.split(
              ','
            );
            this.eBayListingProfile.parentCategoryId = parseInt(
              categoryArray[0]
            );
            this.setCategoryDropdownsValues(categoryArray);
            for (let i = 0; i < categoryArray.length; i++) {
              this.listingService
                .geteBayCategoryByCategoryId(parseInt(categoryArray[i]))
                .subscribe(
                  (response) => {
                    if (response.body.status == 200) {
                      let data = response.body.data;
                      switch (i) {
                        case 0:
                          this.eBayCategoryLevel1Categories = data;
                          var leafNode = this.eBayCategories.find(
                            (c) => c.categoryId == parseInt(categoryArray[i])
                          );
                          if (leafNode && leafNode.leafCategoryTreeNode)
                            this.geteBayCategoryAspects(
                              parseInt(categoryArray[i])
                            );
                          break;
                        case 1:
                          this.eBayCategoryLevel2Categories = data;
                          var leafNode = this.eBayCategoryLevel1Categories.find(
                            (c) => c.categoryId == parseInt(categoryArray[i])
                          );
                          if (leafNode && leafNode.leafCategoryTreeNode)
                            this.geteBayCategoryAspects(
                              parseInt(categoryArray[i])
                            );
                          break;
                        case 2:
                          this.eBayCategoryLevel3Categories = data;
                          this.eBayListingProfile.categoryLevel3 = parseInt(
                            categoryArray[i]
                          );
                          var leafNode = this.eBayCategoryLevel2Categories.find(
                            (c) => c.categoryId == parseInt(categoryArray[i])
                          );
                          if (leafNode && leafNode.leafCategoryTreeNode)
                            this.geteBayCategoryAspects(
                              parseInt(categoryArray[i])
                            );
                          break;
                        case 3:
                          this.eBayCategoryLevel4Categories = data;
                          this.eBayListingProfile.categoryLevel4 = parseInt(
                            categoryArray[i]
                          );
                          var leafNode = this.eBayCategoryLevel3Categories.find(
                            (c) => c.categoryId == parseInt(categoryArray[i])
                          );
                          if (leafNode && leafNode.leafCategoryTreeNode)
                            this.geteBayCategoryAspects(
                              parseInt(categoryArray[i])
                            );
                          break;
                        case 4:
                          this.eBayCategoryLevel5Categories = data;
                          this.eBayListingProfile.categoryLevel5 = parseInt(
                            categoryArray[i]
                          );
                          var leafNode = this.eBayCategoryLevel4Categories.find(
                            (c) => c.categoryId == parseInt(categoryArray[i])
                          );
                          if (leafNode && leafNode.leafCategoryTreeNode)
                            this.geteBayCategoryAspects(
                              parseInt(categoryArray[i])
                            );
                          break;
                        default:
                          break;
                      }
                    }
                  },
                  (error) => {
                    console.log('error', error.message);
                  }
                );
            }
            this.setupeBayFormGroup.patchValue(this.eBayListingProfile);
          } else {
            //this.notificationService.Error(response.body.message);
            this.getProductById();
          }
        },
        (error) => {
          this.notificationService.Error(error.message);
        }
      );
  }

  setCategoryDropdownsValues(categoryArray) {
    if (categoryArray.length > 0) {
      for (var i = 0; i < categoryArray.length; i++) {
        switch (i) {
          case 1:
            this.setupeBayFormGroup.controls.categoryLevel1.setValue(
              parseInt(categoryArray[i])
            );
            break;
          case 2:
            this.setupeBayFormGroup.controls.categoryLevel2.setValue(
              parseInt(categoryArray[i])
            );
            break;
          case 3:
            this.setupeBayFormGroup.controls.categoryLevel3.setValue(
              parseInt(categoryArray[i])
            );
            break;
          case 4:
            this.setupeBayFormGroup.controls.categoryLevel4.setValue(
              parseInt(categoryArray[i])
            );
            break;
          case 5:
            this.setupeBayFormGroup.controls.categoryLevel5.setValue(
              parseInt(categoryArray[i])
            );
            break;
        }
      }
    }
  }

  handleSpecificationsChange(event, index, aspectName) {
    this.aspectType = event.value;
    if (event.value === 'eBayRecommended') {
      this.customAttributesFilter[index] = this.customAttributes.filter(
        (c) => c.aspectType == 'eBay' && c.aspectName == aspectName
      );
      this.specificationsValues = this.specificationsValues.filter(
        (x) => x.groupIndex !== index
      );
    } else if (event.value === 'CustomAttributes') {
      this.customAttributesFilter[index] = this.customAttributes.filter(
        (c) => c.aspectType == 'custom'
      );
      this.specificationsValues = this.specificationsValues.filter(
        (x) => x.groupIndex !== index
      );
    }
  }

  handleSpecificationsValueChange(
    event,
    index,
    aspectName,
    listingprofilespecificsId
  ) {
    if (event.value) {
      let customAttrId = null;
      if (this.aspectType == 'CustomAttributes') {
        let selectedAttr = this.customAttributesFilter[index].find(
          (x) => x.value == event.value
        );
        customAttrId = selectedAttr.customFieldId;
      }
      let aspect = {
        groupIndex: index,
        aspectName: aspectName,
        aspectType: this.aspectType,
        aspectValue: event.value,
        listingProfileItemSpecificsId:
          listingprofilespecificsId == null ? 0 : listingprofilespecificsId,
        customFieldId: customAttrId,
      };
      let isValueUpdated = false;
      if (this.specificationsValues.length > 0) {
        this.specificationsValues.forEach((value, key) => {
          if (value.aspectName === aspectName) {
            // this.specificationsValues.splice(key,1);
            var temp = value;
            temp.aspectValue = aspect.aspectValue;
            temp.customFieldId = aspect.customFieldId;
            isValueUpdated = true;
          }
        });
      }
      if (!isValueUpdated) this.specificationsValues.push(aspect);
    }
  }

  handleListingStyleChange(event) {
    if (event.value === 'FixedPriceItem') {
      this.eBayListingDurationFiltered = this.eBayListingDuration.filter(
        (c) => c.text === 'GTC'
      );
    } else {
      this.eBayListingDurationFiltered = this.eBayListingDuration.filter(
        (c) => c.text !== 'GTC'
      );
    }
  }

  //To save category & aspects
  onSubmit() {
    if (this.setupeBayFormGroup.invalid) {
      return;
    } else {
      this.submitted = true;
      let postData = this.setupeBayFormGroup.value;
      this.primaryCategory = postData.parentCategoryId.toString();
      if (postData.categoryLevel1)
        this.primaryCategory = this.primaryCategory.concat(
          ',' + postData.categoryLevel1.toString()
        );
      if (postData.categoryLevel2)
        this.primaryCategory = this.primaryCategory.concat(
          ',' + postData.categoryLevel2.toString()
        );
      if (postData.categoryLevel3)
        this.primaryCategory = this.primaryCategory.concat(
          ',' + postData.categoryLevel3.toString()
        );
      if (postData.categoryLevel4)
        this.primaryCategory = this.primaryCategory.concat(
          ',' + postData.categoryLevel4.toString()
        );
      if (postData.categoryLevel5)
        this.primaryCategory = this.primaryCategory.concat(
          ',' + postData.categoryLevel5.toString()
        );
      postData.primaryCategory = this.primaryCategory;
      postData.companyId = this.userData.companyId;
      if (this.inventoryId != undefined) {
        postData.inventoryId = this.inventoryId;
        postData.inventoryIds = null;
      } else {
        postData.inventoryId = null;
        postData.inventoryIds = this.inventoryIds;
      }
      postData.userMarketplaceId = this.userMarketplace.userMarketplaceId;
      postData.userMarketplaceSiteId = this.userMarketplace.userMarketplaceSiteMapId;
      postData.conditionEnabled = true;
      postData.eBayListingProfileItemSpecifics = this.specificationsValues;

      this.listingService.saveUpdateeBayListingProfile(postData).subscribe(
        (response) => {
          if (response.body.status === 200) {
            this.notificationService.Success(response.body.message);
            this.dialogRef.close();
          } else {
            this.notificationService.Error(response.body.message);
          }
        },
        (error) => {
          this.notificationService.Error(error.message);
        }
      );
    }
  }
}
