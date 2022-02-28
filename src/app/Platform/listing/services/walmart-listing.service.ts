import { Injectable } from '@angular/core';
import { ApiService } from 'libs/core-services/src';

@Injectable({
  providedIn: 'root'
})

export class WalmartListingService {

  private getWalmartMasterCategoriesUrl = "WalmartListing/GetWalmartMasterCategories";
  private getWalmartMasterSubCategoriesUrl = "WalmartListing/GetWalmartMasterSubCategories/";
  private getWalmartMasterSubCategoryPropertiesUrl = "WalmartListing/GetWalmartMasterSubCategoryProperties/";
  private saveWalmartProductCategorySpecsUrl = "WalmartListing/SaveWalmartProductCategorySpecs";
  private getWalmartCommonContentPropertiesUrl = "WalmartListing/GetWalmartCommonContentProperties";
  private syncWalmartOrdersUrl = "WalmartListing/SyncWalmartOrders";
  private productFeedsListingWalmartUrl = "WalmartListing/ProductFeedsListingWalmart";

  constructor(private coreService: ApiService) {
  }

  //To get Walmart master categories
  getWalmartMasterCategories() {
    return this.coreService.getData(this.getWalmartMasterCategoriesUrl, null);
  }

  //To get Walmart master sub-categories
  getWalmartMasterSubCategories(categoryID: number) {
    return this.coreService.getData(this.getWalmartMasterSubCategoriesUrl + categoryID, null);
  }

  //To get Walmart master sub-category properties
  getWalmartMasterSubCategoryProperties(subCategoryID: number) {
    return this.coreService.getData(this.getWalmartMasterSubCategoryPropertiesUrl + subCategoryID, null);
  }

  //To Save Walmart Product Category Specs
  saveWalmartProductCategorySpecs(payload) {
    return this.coreService.postData(this.saveWalmartProductCategorySpecsUrl, payload, null);
  }
  
//To get Walmart content commons properties
getWalmartCommonContentProperties() {
  return this.coreService.getData(this.getWalmartCommonContentPropertiesUrl, null);
}

//To Sync Walmart Orders
syncWalmartOrders(payload) {
  return this.coreService.postData(this.syncWalmartOrdersUrl, payload, null);
}

//To Product Feeds Listing Walmart
productFeedsListingWalmart(payload) {
  return this.coreService.postData(this.productFeedsListingWalmartUrl, payload, null);
}

}
