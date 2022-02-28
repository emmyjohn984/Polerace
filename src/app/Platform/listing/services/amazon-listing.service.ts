import { Injectable } from '@angular/core';
import { ApiService } from 'libs/core-services/src/lib/api-service/api.service';

@Injectable({
  providedIn: 'root'
})
export class AmazonListingService {

  private getAmazonMasterCategoriesUrl = "AmazonListing/GetAmazonMasterCategories/";
  private getAmazonMasterGlobalDataUrl = "AmazonListing/GetAmazonMasterGlobalData/";
  private getAmazonCategorySpecificationsUrl = "AmazonListing/GetAmazonCategorySpecifications/";
  private addOrUpdateAmazonLisitingUrl = "AmazonListing/AddorUpdateAmazonListing";
  private getAmazonListingProfileUrl = "AmazonListing/GetAmazonListingProfile/";
  private listProductsFeedOnAmazonUrl = "AmazonListing/ListProductsFeedOnAmazon";
  private getAmazonOrdersUrl = "AmazonListing/GetAmazonOrders/";
  private getAmazonProductTypeCategoriesUrl = "AmazonListing/GetAmazonProductTypeCategories";
  private readXSDCategoryProductDataUrl = "AmazonListing/ReadXSDCategoryProductData/";
  private getAmazonFeedsStatusUrl = "AmazonListing/GetAmazonFeedsStatus/";
  private getAmazonFeedSubmissionListUrl = "AmazonListing/GetAmazonFeedSubmissionList";

  constructor(private coreService: ApiService) {
  }

  //To get Amazon master categories
  getAmazonMasterCategories(categoryNodeId: string, globalMarketplaceSiteId: number) {
    return this.coreService.getData(this.getAmazonMasterCategoriesUrl + categoryNodeId + "/" + globalMarketplaceSiteId, null);
  }

  //To get Amazon master categories
  getAmazonListingProfileData(inventoryId: string, userMarketPlaceId: number) {
    return this.coreService.getData(this.getAmazonListingProfileUrl + inventoryId + "/" + userMarketPlaceId, null);
  }

  //To get Amazon master global data
  getAmazonMasterGlobalData(globalDataType: string) {
    return this.coreService.getData(this.getAmazonMasterGlobalDataUrl + globalDataType, null);
  }

  //To get Amazon category specifications
  getAmazonCategorySpecifications(nodeId: string) {
    return this.coreService.getData(this.getAmazonCategorySpecificationsUrl + nodeId, null);
  }

  addOrUpdateAmazonListing(payload) {
    return this.coreService.postData(this.addOrUpdateAmazonLisitingUrl, payload, null);
  }

  //To call list product on Amazon
  listProductsFeedOnAmazon(payload) {
    return this.coreService.postData(this.listProductsFeedOnAmazonUrl, payload, null);
  }

  //Get Amazon orders
  getAmazonOrders(startDate, endDate) {
    return this.coreService.getData(this.getAmazonOrdersUrl + startDate + '/' + endDate, null);
  }

  //To get Amazon product type categories
  getAmazonProductTypeCategories() {
    return this.coreService.getData(this.getAmazonProductTypeCategoriesUrl, null);
  }

  //To get read Amazon product type categories XSD
  readXSDCategoryProductData(category: string) {
    return this.coreService.getData(this.readXSDCategoryProductDataUrl + category, null);
  }

  //To get Amazon feeds status
  getAmazonFeedsStatus(companyID: number) {
    return this.coreService.getData(this.getAmazonFeedsStatusUrl + companyID, null);
  }

   //To sync Amazon feeds statuses
   getAmazonFeedSubmissionList() {
    return this.coreService.getData(this.getAmazonFeedSubmissionListUrl, null);
  }
}
