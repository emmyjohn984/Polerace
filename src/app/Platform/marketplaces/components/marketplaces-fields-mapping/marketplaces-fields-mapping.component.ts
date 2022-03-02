import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { MarketplacesService } from '../../services/marketplaces.service';
import { Channels } from 'src/app/shared/enums/channels';
import { PermissionsHelper } from 'src/app/shared/helpers/permissions-helper';

@Component({
  selector: 'app-marketplaces-fields-mapping',
  templateUrl: './marketplaces-fields-mapping.component.html',
  styleUrls: ['./marketplaces-fields-mapping.component.scss']
})

export class MarketplacesFieldsMappingComponent implements OnInit {

  mappingAddForm: FormGroup
  amazonFieldsControlsArray: FormArray;
  walmartFieldsControlsArray: FormArray;
  eBayFieldsControlsArray: FormArray;
  masterApplicationFields: Array<any> = [];
  marketplacesFields: Array<any> = [];
  selectedIndex: number = 0;
  userData: any = {};
  marketplacesMappedFieldList: Array<any> = [];
  userRole: string;
  keyword = 'fieldName';
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  displayProgressSpinner = false;

  constructor(private formBuilder: FormBuilder, private marketplacesService: MarketplacesService, private notificationService: NotificationService, public permissionsHelper: PermissionsHelper) {
    this.mappingAddForm = this.formBuilder.group({
      walmartFieldsArray: this.formBuilder.array([]),
      eBayFieldsArray: this.formBuilder.array([]),
      amazonFieldsArray: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('currentUser')?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser'));
    this.userRole = this.userData.roleName.toLowerCase();
    this.getMasterApplicationFields();
    this.getMarketplacesMappedFields();
  }

  public nextStep() {
    this.selectedIndex += 1;
  }

  previousStep() {
    this.selectedIndex -= 1;
  }

  selectEvent(item, index) {
    // do something with selected item
    if (typeof item === 'string' || item instanceof String) { }
    else {
      let controls = this.getAmazonFieldsControls;
      controls.at(index).get('applicationFieldId').patchValue(item.applicationFieldId);
    }
  }

  selectEventeBay(item, index) {
    if (typeof item === 'string' || item instanceof String) { }
    else {
      let controls = this.geteBayFieldsControls;
      controls.at(index).get('applicationFieldId').patchValue(item.applicationFieldId);
    }
  }

  selectEventWalmart(item, index) {
    if (typeof item === 'string' || item instanceof String) { }
    else {
      let controls = this.getWalmartFieldsControls;
      controls.at(index).get('applicationFieldId').patchValue(item.applicationFieldId);
    }
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something when input is focused
  }

  getMarketplacesMappedFields() {
    this.displayProgressSpinner = true;
    this.marketplacesService.getMarketplacesMappedFields(this.userData.companyId).subscribe(response => {
      if (response != null) {
        this.marketplacesMappedFieldList = response.body.data;
        this.displayProgressSpinner = false;
        let eBayFields = this.marketplacesMappedFieldList.filter(c => c.globalMarketplaceId == Channels.eBay);
        eBayFields.forEach(element => {
          element.companyId = this.userData.companyId;
          this.eBayFieldsControlsArray.push(this.createWalmartFields(element))

        });
        let amazonFields = this.marketplacesMappedFieldList.filter(c => c.globalMarketplaceId == Channels.Amazon);
        amazonFields.forEach(element => {
          element.companyId = this.userData.companyId;
          this.amazonFieldsControlsArray.push(this.createWalmartFields(element))
        });
        let walmartFields = this.marketplacesMappedFieldList.filter(c => c.globalMarketplaceId == Channels.Walmart);
        walmartFields.forEach(element => {
          element.companyId = this.userData.companyId;
          this.walmartFieldsControlsArray.push(this.createWalmartFields(element))
        });
      }
      else {
        this.displayProgressSpinner = false;
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.displayProgressSpinner = false;
      this.notificationService.Error('Something went wrong. Please try again later');
    });
  }

  getMasterApplicationFields() {
    this.marketplacesService.getMasterApplicationFields().subscribe(response => {
      if (response != null) {
        this.masterApplicationFields = response.body.data;
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error('Something went wrong. Please try again later');
    });
  }

  getMarketplacesMapFields() {
    this.marketplacesService.getMarketplacesFields(Channels.Walmart).subscribe(response => {
      if (response != null) {
        this.marketplacesFields = response.body.data;
        this.marketplacesFields.forEach(element => {
          element.companyId = this.userData.companyId;
          element.globalMarketplaceId = Channels.Walmart;
          this.walmartFieldsControlsArray.push(this.createWalmartFields(element))
        });
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error('Something went wrong. Please try again later');
    });
  }

  createWalmartFields(d?): FormGroup {
    return this.formBuilder.group({
      applicationFieldId: [d && d.applicationFieldId ? d.applicationFieldId : 0],
      applicationFieldObject: [d && d.applicationFieldObject ? d.applicationFieldObject : ''],
      applicationFieldName: [d && d.applicationFieldName ? d.applicationFieldName : ''],
      marketplaceFieldId: [d && d.marketplaceFieldId ? d.marketplaceFieldId : 0],
      marketplaceFieldName: [d && d.fieldName ? d.fieldName : ''],
      companyId: [d && d.companyId ? d.companyId : 0],
      globalMarketplaceId: [d && d.globalMarketplaceId ? d.globalMarketplaceId : 0],
      marketplacesApplicationMappedFieldId: [d && d.marketplacesApplicationMappedFieldId ? d.marketplacesApplicationMappedFieldId : 0],
      required: [d && d.required ? d.required : 0]
    });
  }

  get getAmazonFieldsControls() {
    this.amazonFieldsControlsArray = this.mappingAddForm.get('amazonFieldsArray') as FormArray;
    return this.amazonFieldsControlsArray;
  }

  get geteBayFieldsControls() {
    this.eBayFieldsControlsArray = this.mappingAddForm.get('eBayFieldsArray') as FormArray;
    return this.eBayFieldsControlsArray;
  }

  get getWalmartFieldsControls() {
    this.walmartFieldsControlsArray = this.mappingAddForm.get('walmartFieldsArray') as FormArray;
    return this.walmartFieldsControlsArray;
  }

  onSubmit(e) {
    if (!this.mappingAddForm.invalid) {

      let postData = {
        amazonApplicationMappedFields: this.mappingAddForm.value.amazonFieldsArray,
        WalmartApplicationMappedFields: this.mappingAddForm.value.walmartFieldsArray,
        eBayApplicationMappedFields: this.mappingAddForm.value.eBayFieldsArray
      }

      this.marketplacesService.addUpdateMarketplaceMappingFields(postData).subscribe(response => {
        if (response != null) {
          this.notificationService.Success(response.body.message);
        }
        else {
          this.notificationService.Error(response.body.message);
        }
      }, error => {
        this.notificationService.Error(error.message);
      });
    }
  }
}
