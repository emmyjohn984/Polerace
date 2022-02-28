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
import { AmazonListingService } from '../../services/amazon-listing.service';
import { InventoryService } from 'src/app/Platform/inventory/services/inventory.service';

@Component({
  selector: 'app-amazon-category-specifications-dialog',
  templateUrl: './amazon-category-specifications-dialog.component.html',
  styleUrls: ['./amazon-category-specifications-dialog.component.scss'],
})
export class AmazonCategorySpecificationsDialogComponent implements OnInit {
  amazonCategoryFormGroup: FormGroup;
  primaryCategory: string = '';
  categoryNodeId: string = 'L1-0';
  selectedIndex: number = 0;
  amazonMasterCategories: Array<any> = [];
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
  amazonListingCondition: Array<any> = [];
  eBayListingDurationFiltered: Array<any> = [];
  customAttrIndexesForEdit: Array<any> = [];
  categoryFormArray: FormArray;
  listedCategories: Array<any> = [];
  inventoryIds: Array<any> = [];
  productTypeCategories: Array<any> = [];
  categoryProductData: any = {};
  categoryProductTypeOptions: Array<any> = [];
  categoryProductTypeElements: Array<any> = [];
  categoryProductTypeChoices: Array<any> = [];
  categoryProductTypeChoiceAttributes: Array<any> = [];
  categoryProductTypeAttributeFormArray: FormArray;
  categoryProductAttributeFormArray: FormArray;
  productTypeVariationAttribute: Array<any> = [];
  variationElementValues: Array<any> = [];
  product: any = {};

  constructor(
    public dialogRef: MatDialogRef<AmazonCategorySpecificationsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private listingService: ListingService,
    private notificationService: NotificationService,
    private amazonListingService: AmazonListingService,
    private route: ActivatedRoute,
    private inventoryService: InventoryService
  ) {
    this.inventoryId = data.inventoryId;
    this.inventoryIds = data.inventoryIds;
    this.userMarketplace = data.userMarketplace;
  }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('currentUser'));
    this.amazonCategoryFormGroup = this.formBuilder.group({
      amazonListingProfileId: [0],
      listingTitle: ['', Validators.required],
      conditionTypeId: ['', Validators.required],
      conditionNote: [''],
      categoryArray: this.formBuilder.array([]),
      customAttributes: this.formBuilder.array([]),
      productTypeCategory: [''],
      productType: [''],
      categoryProductTypeAttributes: this.formBuilder.array([]),
      categoryProductAttributes: this.formBuilder.array([]),
    });
    this.getAmazonMasterCategories(this.categoryNodeId);
    this.getAmazonListingCondition();
    this.getAmazonProductTypeCategories();
    this.getAmazonListingProfile();
  }

  //To get product by id
  getProductById() {
    this.inventoryService.getProductById(this.inventoryId).subscribe(
      (response) => {
        if (response != null && response.body.status == 200) {
          this.product = response.body.data.inventory;
          this.amazonCategoryFormGroup
            .get('listingTitle')
            .setValue(this.product.title);
          let condition = this.amazonListingCondition.find(
            (c) =>
              c.amazonMasterGlobalDataValue == this.product.amazonConditionValue
          );
          if (condition) {
            this.amazonCategoryFormGroup
              .get('conditionTypeId')
              .setValue(condition.amazonMasterGlobalDataValue);
          }
          this.primaryCategory = this.product.amazonCategoryNodeId;
          this.categoryFormArray.push(
            this.createCategory({ categoryId: this.primaryCategory })
          );
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
    return this.amazonCategoryFormGroup.controls;
  }

  get getCategoryArrayControls() {
    this.categoryFormArray = this.amazonCategoryFormGroup.get(
      'categoryArray'
    ) as FormArray;
    return this.categoryFormArray;
  }

  get getArrayControls() {
    return this.amazonCategoryFormGroup.get('customAttributes') as FormArray;
  }

  //categoryProductTypeAttributes
  get getcategoryProductTypeAttributesControls() {
    this.categoryProductTypeAttributeFormArray = this.amazonCategoryFormGroup.get(
      'categoryProductTypeAttributes'
    ) as FormArray;
    return this.categoryProductTypeAttributeFormArray;
  }

  get getcategoryProductAttributesControls() {
    this.categoryProductAttributeFormArray = this.amazonCategoryFormGroup.get(
      'categoryProductAttributes'
    ) as FormArray;
    return this.categoryProductAttributeFormArray;
  }

  createCategory(d?: any): FormGroup {
    return this.formBuilder.group({
      categoryId: [
        d && d.categoryId ? d.categoryId : null,
        Validators.compose([Validators.required]),
      ],
    });
  }

  createProductTypeAtttribute(d?: any): FormGroup {
    return this.formBuilder.group({
      amazonListingProfileProductDataId: [
        d && d.amazonListingProfileProductDataId
          ? d.amazonListingProfileProductDataId
          : 0,
      ],
      productTypeAttributeName: [
        d && d.elementName ? d.elementName : null,
        Validators.compose([Validators.required]),
      ],
      productTypeAttributeValue: [d && d.elementValue ? d.elementValue : null],
      variationData: this.formBuilder.array([]),
    });
  }

  createProductAtttribute(d?: any): FormGroup {
    return this.formBuilder.group({
      amazonListingProfileProductDataId: [
        d && d.amazonListingProfileProductDataId
          ? d.amazonListingProfileProductDataId
          : 0,
      ],
      productAttributeName: [d && d.elementName ? d.elementName : null],
      productAttributeValue: [d && d.elementValue ? d.elementValue : null],
    });
  }

  timer(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  //TO GET Amazon Listing Profile
  getAmazonListingProfile() {
    if (this.inventoryId != undefined) {
      this.amazonListingService
        .getAmazonListingProfileData(
          this.inventoryId,
          this.userMarketplace.userMarketplaceSiteMapId
        )
        .subscribe(
          async (response) => {
            if (response != null && response.body.status == 200) {
              this.eBayListingProfile = response.body.data;
              if (this.eBayListingProfile != null) {
                let categoryArray = this.eBayListingProfile.primaryCategory.split(
                  ','
                );
                this.eBayListingProfile.parentCategoryId = parseInt(
                  categoryArray[0]
                );

                categoryArray.forEach(async (category, key) => {
                  this.listedCategories.push({
                    categoryId: parseInt(category),
                  });
                  this.categoryFormArray.push(
                    this.createCategory(this.listedCategories[key])
                  );
                  let e = { value: parseInt(category) };
                  if (key == 0)
                    this.handleParentCatergoryChangeWithDelay(e, key);
                  else
                    await this.timer(key * 1000).then(() => {
                      this.handleParentCatergoryChangeWithDelay(e, key);
                    });
                });

                this.eBayListingProfile.categoryArray = this.listedCategories;
                this.amazonCategoryFormGroup
                  .get('conditionTypeId')
                  .setValue(this.eBayListingProfile.conditionTypeId);
                //Handle product data edit
                await this.timer(1000).then(() => {
                  this.handleProductData();
                });
                this.amazonCategoryFormGroup.patchValue(
                  this.eBayListingProfile
                );
              } else {
                this.getProductById();
              }
            } else {
              this.categoryFormArray.push(this.createCategory());
            }
          },
          (error) => {
            this.notificationService.Error(error.message);
          }
        );
    } else {
      this.getCategoryArrayControls.push(this.createCategory());
    }
  }

  private async handleProductData() {
    if (
      this.eBayListingProfile.amazonListingProfileCategorySpecificProductData
        .length > 0
    ) {
      let prouctData = this.eBayListingProfile
        .amazonListingProfileCategorySpecificProductData;
      let productTypeCategory = this.productTypeCategories.find(
        (c) => c.categorySortName == prouctData[0].productTypeCategory
      );
      this.amazonCategoryFormGroup
        .get('productTypeCategory')
        .setValue(productTypeCategory.amazonProductTypeCategoryId);
      await this.timer(1000).then(() => {
        this.readXSDCategoryProductData(productTypeCategory.categorySortName);
      });
      this.amazonCategoryFormGroup
        .get('productType')
        .setValue(prouctData[0].productType);
      this.getProductTypeAttributes(prouctData[0].productType, prouctData);
    }
  }

  private getProductTypeAttributes(name, prouctData) {
    prouctData.forEach((item, key) => {
      setTimeout(() => {
        this.getProductTypeChoiceAttributes(name);
        if (item.elementName == 'VariationData') {
          let variationData = this.categoryProductTypeChoiceAttributes.find(
            (c) => c.productTypeChoiceAttribute == 'VariationData'
          );
          this.productTypeVariationAttribute[key] =
            variationData.productTypeVariationData;
          this.productTypeVariationAttribute[key].forEach((d, i) => {
            this.variationElementValues[i] = d.variationElementValues;
          });
        }
      }, 4000);

      if (item.productType !== '') {
        this.getcategoryProductTypeAttributesControls.push(
          this.createProductTypeAtttribute(item)
        );
      } else {
        this.getcategoryProductAttributesControls.push(
          this.createProductAtttribute(item)
        );
      }
      //VariationData
      item.amazonListingProfileProductTypeVariations.forEach((itm, index) => {
        this.addvariationData(itm, key, index);
      });
    });
  }

  async handleParentCatergoryChangeWithDelay(event, index) {
    this.amazonListingService
      .getAmazonMasterCategories(
        event.value,
        this.userMarketplace.globalMarketplaceSiteId
      )
      .subscribe(
        (response) => {
          if (
            response != null &&
            response.body.data.length > 0 &&
            response.body.status == 200
          ) {
            this.amazonMasterCategories[index + 1] = response.body.data;
            if (this.amazonMasterCategories[index] != undefined) {
              let filteredNode = this.amazonMasterCategories[index].filter(
                (x) => x.nodeId == event.value
              );
              if (filteredNode.length > 0)
                if (index == this.listedCategories.length - 1)
                  this.geteBayCategoryAspects(filteredNode[0].nodeId);
            }
            if (index == 0 && this.categoryFormArray.controls.length > 1) {
              this.categoryFormArray.clear();
            } else {
              this.clearControlAfterChange(this.categoryFormArray, index + 1);
              this.amazonMasterCategories.splice(
                index + 2,
                this.amazonMasterCategories.length
              );
            }
            if (
              this.amazonMasterCategories.length >
              this.categoryFormArray.controls.length
            )
              if (this.listedCategories.length > 0) {
                this.categoryFormArray.push(
                  this.createCategory(this.listedCategories[index])
                );
              } else {
                this.categoryFormArray.push(this.createCategory());
              }
          } else {
            if (this.categoryFormArray.length < this.listedCategories.length) {
              this.categoryFormArray.push(
                this.createCategory(this.listedCategories[index])
              );
            } else if (this.listedCategories.length == 0) {
              this.categoryFormArray.push(this.createCategory());
            }
            this.eBayCategoryAspects = [];
            this.customAttributes = [];
          }
        },
        (error) => {
          this.notificationService.Error(error.message);
        }
      );
  }

  handleParentCategoryChange(event, index) {
    this.amazonListingService
      .getAmazonMasterCategories(
        event.value,
        this.userMarketplace.globalMarketplaceSiteId
      )
      .subscribe(
        (response) => {
          if (
            response != null &&
            response.body.data.length > 0 &&
            response.body.status == 200
          ) {
            this.amazonMasterCategories[index + 1] = response.body.data;
            this.geteBayCategoryAspects(
              this.amazonMasterCategories[index].filter(
                (x) => x.nodeId == event.value
              )[0].nodeId
            );
            if (index == 0 && this.categoryFormArray.controls.length > 1) {
              this.categoryFormArray.clear();
            } else {
              this.clearControlAfterChange(this.categoryFormArray, index + 1);
              this.amazonMasterCategories.splice(
                index + 2,
                this.amazonMasterCategories.length
              );
            }
            if (
              this.amazonMasterCategories.length >
              this.categoryFormArray.controls.length
            )
              this.categoryFormArray.push(this.createCategory());
          } else {
            this.eBayCategoryAspects = [];
            this.customAttributes = [];
            this.amazonMasterCategories[index + 1] = [];
            for (let i = this.categoryFormArray.length - 1; i > index; i--) {
              this.categoryFormArray.removeAt(i);
            }
          }
        },
        (error) => {
          this.notificationService.Error(error.message);
        }
      );
  }

  clearControlAfterChange(form: FormArray, index) {
    for (var i = form.controls.length; i > index; i--) {
      form.removeAt(i);
    }
  }

  // To get Amazon master categories
  getAmazonMasterCategories(categoryNodeId) {
    this.amazonListingService
      .getAmazonMasterCategories(
        categoryNodeId,
        this.userMarketplace.globalMarketplaceSiteId
      )
      .subscribe(
        (response) => {
          if (response != null && response.body.status == 200) {
            this.amazonMasterCategories[0] = response.body.data;
          } else {
            this.notificationService.Error(response.body.message);
          }
        },
        (error) => {
          this.notificationService.Error(error.message);
        }
      );
  }

  // To get Amazon specifics
  geteBayCategoryAspects(nodeId) {
    this.customAttributes = [];
    this.eBayCategoryAspects = [];
    this.getCustomAttributes(this.inventoryId);
    setTimeout(() => {
      this.amazonListingService
        .getAmazonCategorySpecifications(nodeId)
        .subscribe(
          (response) => {
            if (response.body.status == 200) {
              this.eBayCategoryAspects = response.body.data;

              this.eBayCategoryAspects.forEach((item, key) => {
                if (item.localizedValues) {
                  for (var i = 0; i < item.localizedValues.length; i++) {
                    let attribute = {
                      value:
                        item.localizedValues[i].amazonCategorySpecificationId,
                      text: item.localizedValues[i].specificationValue,
                      aspectName: item.localizedAspectName,
                      aspectType: 'Amazon',
                    };
                    this.customAttributes.push(attribute);
                  }
                  if (
                    this.eBayListingProfile != undefined ||
                    this.eBayListingProfile != null
                  ) {
                    if (
                      this.eBayListingProfile
                        .amazonListingProfileItemSpecifics != undefined &&
                      this.eBayListingProfile.amazonListingProfileItemSpecifics
                        .length > 0
                    )
                      var t = this.fillValuesInEditMode(item);

                    if (t !== undefined) {
                      var event = { value: t.aspectType };
                      this.handleSpecificationsChange(event, key, t.aspectName);
                      var event1 = { value: t.value };

                      this.handleSpecificationsValueChange(
                        event1,
                        key,
                        t.aspectName,
                        t.id
                      );

                      if (this.aspectType == '') {
                      }
                      const formtest = new FormGroup({
                        id: new FormControl(t.aspectType),
                        pass: new FormControl(t.value),
                      });
                      this.getArrayControls.push(formtest);
                    } else {
                      const formtest = new FormGroup({
                        id: new FormControl(''),
                        pass: new FormControl(''),
                      });
                      this.getArrayControls.push(formtest);
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
    var listingspecifics = this.eBayListingProfile.amazonListingProfileItemSpecifics.filter(
      (c) => c.aspectName == item.localizedAspectName
    );
    if (listingspecifics.length > 0) {
      var customAttr = {
        value: listingspecifics[0].aspectValue.toString(),
        text: null,
        aspectName: listingspecifics[0].aspectName,
        aspectType: listingspecifics[0].aspectType,
        id: listingspecifics[0].listingProfileItemSpecificsId,
      };
      return customAttr;
    } else {
      return undefined;
    }
  }

  // To Amazon Listing Condition Types
  getAmazonListingCondition() {
    this.amazonListingService
      .getAmazonMasterGlobalData('ConditionType')
      .subscribe(
        (response) => {
          if (response != null && response.body.status == 200) {
            this.amazonListingCondition = response.body.data;
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
  getCustomAttributes(inventoryId) {
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
          }
        },
        (error) => {
          this.notificationService.Error(error.message);
        }
      );
  }

  handleSpecificationsChange(event, index, aspectName) {
    this.aspectType = event.value;
    if (event.value === 'AmazonRecommended') {
      this.customAttributesFilter[index] = this.customAttributes.filter(
        (c) => c.aspectType == 'Amazon' && c.aspectName == aspectName
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
          (x) => x.text == event.value
        );
        customAttrId = selectedAttr.customFieldId;
      }
      let aspect = {
        groupIndex: index,
        aspectName: aspectName,
        aspectType: this.aspectType,
        aspectValue: event.value,
        aspectValueText: event.value,
        listingProfileItemSpecificsId:
          listingprofilespecificsId == null ? 0 : listingprofilespecificsId,
        customFieldId: customAttrId,
      };
      let isValueUpdated = false;
      if (this.specificationsValues.length > 0) {
        this.specificationsValues.forEach((value, key) => {
          if (value.aspectName === aspectName) {
            var temp = value;
            temp.aspectValue = aspect.aspectValue.toString();
            temp.customFieldId = aspect.customFieldId;
            isValueUpdated = true;
          }
        });
      }
      if (!isValueUpdated) this.specificationsValues.push(aspect);
    }
  }

  //To save category & aspects
  onSubmit() {
    if (this.amazonCategoryFormGroup.invalid) {
      return;
    } else {
      this.submitted = true;
      let postData = this.amazonCategoryFormGroup.value;
      postData.companyId = this.userData.companyId;
      if (this.inventoryId != undefined) {
        postData.inventoryId = this.inventoryId;
        postData.inventoryIds = null;
      } else {
        postData.inventoryIds = this.inventoryIds;
        postData.inventoryId = null;
      }
      postData.userMarketplaceId = this.userMarketplace.userMarketplaceId;
      postData.userMarketplaceSiteId = this.userMarketplace.userMarketplaceSiteMapId;
      postData.conditionEnabled = true;
      postData.amazonListingProfileItemSpecifics = this.specificationsValues;

      var categorySpecificProductData = [];
      var productTypeCategory = this.productTypeCategories.find(
        (c) => c.amazonProductTypeCategoryId == postData.productTypeCategory
      );
      postData.categoryProductTypeAttributes.forEach((item, key) => {
        let productData = {
          amazonListingProfileProductDataId:
            item.amazonListingProfileProductDataId,
          productTypeCategory: productTypeCategory.categorySortName,
          productType: postData.productType,
          elementName: item.productTypeAttributeName,
          elementValue: item.productTypeAttributeValue,
          unitOfMeasure: '',
          amazonListingProfileProductTypeVariations: item.variationData,
        };
        categorySpecificProductData.push(productData);
      });

      postData.categoryProductAttributes.forEach((item, key) => {
        let productData = {
          amazonListingProfileProductDataId:
            item.amazonListingProfileProductDataId,
          productTypeCategory: productTypeCategory.categorySortName,
          productType: '',
          elementName: item.productAttributeName,
          elementValue: item.productAttributeValue,
          unitOfMeasure: '',
        };
        categorySpecificProductData.push(productData);
      });

      postData.AmazonListingProfileCategorySpecificProductData = categorySpecificProductData;

      this.amazonListingService.addOrUpdateAmazonListing(postData).subscribe(
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

  // To get Amazon product type categories
  getAmazonProductTypeCategories() {
    this.amazonListingService.getAmazonProductTypeCategories().subscribe(
      (response) => {
        if (response != null && response.body.status == 200) {
          this.productTypeCategories = response.body.data;
        } else {
          this.notificationService.Error(response.body.message);
        }
      },
      (error) => {
        this.notificationService.Error(error.message);
      }
    );
  }

  //To handle product type category change
  handleProductTypeCategoryChange(event) {
    let category = this.productTypeCategories.find(
      (c) => c.amazonProductTypeCategoryId == event.value
    );
    this.readXSDCategoryProductData(category.categorySortName);
    this.categoryProductTypeAttributeFormArray.clear();
    this.categoryProductAttributeFormArray.clear();
  }

  //To read product category
  private readXSDCategoryProductData(category: string) {
    this.amazonListingService.readXSDCategoryProductData(category).subscribe(
      (response) => {
        if (response != null && response.body.status == 200) {
          this.categoryProductData = response.body.data;
          this.categoryProductTypeOptions = this.categoryProductData.categoryProductTypeOptions;
          this.categoryProductTypeElements = this.categoryProductData.categoryProductTypeElements;
          this.categoryProductTypeChoices = this.categoryProductTypeOptions.map(
            (p) => p.productTypeChoiceName
          );
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  handleCategoryProductTypeChoiceChange(event) {
    this.getProductTypeChoiceAttributes(event.value);
    //add row product type choice attributes
    this.categoryProductTypeAttributeFormArray.clear();
    this.categoryProductTypeAttributeFormArray.push(
      this.createProductTypeAtttribute()
    );
    //add row product attribute
    this.categoryProductAttributeFormArray.clear();
    this.categoryProductAttributeFormArray.push(this.createProductAtttribute());
  }

  private getProductTypeChoiceAttributes(productTypeChoiceName) {
    let categoryProductType = this.categoryProductTypeOptions.find(
      (p) => p.productTypeChoiceName == productTypeChoiceName
    );
    this.categoryProductTypeChoiceAttributes =
      categoryProductType.productTypeChoiceAttributes;
  }

  handleProductTypeAttributeChange(event, i) {
    let productTypeAttr = this.categoryProductTypeAttributeFormArray.value.filter(
      (c) => c.productTypeAttributeName == event.value
    );
    if (productTypeAttr.length > 1) {
      this.notificationService.Error(
        'Attribute already added. Please select different.'
      );
    }
    this.productTypeVariationAttribute[i] = [];
    if (event.value == 'VariationData') {
      let variationData = this.categoryProductTypeChoiceAttributes.find(
        (c) => c.productTypeChoiceAttribute == event.value
      );
      this.productTypeVariationAttribute[i] =
        variationData.productTypeVariationData;
      //VariationData
      this.productTypeVariationAttribute[i].forEach((item, key) => {
        this.addvariationData(item, i, key);
      });
    }
  }

  addvariationData(item, i, key) {
    let formArray = this.categoryProductTypeAttributeFormArray.controls[i].get(
      'variationData'
    ) as FormArray;
    formArray.push(
      this.formBuilder.group({
        productTypeVariationDataId: [item.productTypeVariationDataId],
        amazonListingProfileProductDataId: [
          item.amazonListingProfileProductDataId,
        ],
        variationElementName: [item.variationElementName],
        variationElementValue: [item.variationElementValue],
      })
    );
    this.variationElementValues[key] = item.variationElementValues;
  }

  getVariationControls(form) {
    return form.controls.variationData.controls;
  }

  handleVariationAttributeValueChange(event, elementName, index) {
    let formArray = this.categoryProductTypeAttributeFormArray.controls[
      index
    ].get('variationData');
    formArray.value.find(
      (c) => c.variationElementName == elementName
    ).variationElementValue = event.value;
  }

  addAttribute() {
    if (
      this.categoryProductTypeAttributeFormArray.length <
      this.categoryProductTypeChoiceAttributes.length
    )
      this.categoryProductTypeAttributeFormArray.push(
        this.createProductTypeAtttribute()
      );
    else this.notificationService.Error('ProductType attribute limit reached.');
  }

  deleteAttribute(index) {
    let value = this.categoryProductTypeAttributeFormArray.value[index]
      .productTypeAttributeName;
    if (value == 'VariationData') {
      this.productTypeVariationAttribute[index] = [];
    }
    this.categoryProductTypeAttributeFormArray.removeAt(index);
  }

  handlecategoryProductTypeElementChange(event) {
    let productAttr = this.categoryProductAttributeFormArray.value.filter(
      (c) => c.productAttributeName == event.value
    );
    if (productAttr.length > 1) {
      this.notificationService.Error(
        'Attribute already added. Please select different.'
      );
    }
  }

  addProductAttribute() {
    if (
      this.categoryProductAttributeFormArray.length <
      this.categoryProductTypeElements.length
    )
      this.categoryProductAttributeFormArray.push(
        this.createProductAtttribute()
      );
    else this.notificationService.Error('Product attribute limit reached.');
  }

  deleteProductAttribute(index) {
    this.categoryProductAttributeFormArray.removeAt(index);
  }
}
