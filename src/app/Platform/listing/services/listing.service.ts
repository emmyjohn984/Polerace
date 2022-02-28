import { Injectable } from '@angular/core';
import { ApiService } from 'libs/core-services/src';

@Injectable({
  providedIn: 'root'
})

export class ListingService {
  private getUserMarketplacesRegionsURL = "Marketplaces/GetUserMarketplacesRegions/";
  private geteBayCategoryByCategoryIdURL = "Marketplaces/GeteBayCategoryByCategoryId/";
  private geteBayListingStyleURL = "Marketplaces/GeteBayListingStyle";
  private geteBayListingDurationURL = "Marketplaces/GeteBayListingDuration";
  private geteBayCategoryAspectsURL = "Marketplaces/GeteBayCategoryAspects/";
  private getCustomAttributesURL = "Marketplaces/GetInventoryCustomAttributes/";
  private saveUpdateeBayListingProfileURL = "Marketplaces/SaveUpdateeBayListingProfile";
  private geteBayListingProfileURL = "Marketplaces/GeteBayListingProfile/";
  private createeBayInventoryListingURL = "Marketplaces/CreateeBayInventoryListing";
  private geteBayConditionURL = "Marketplaces/GeteBayCondition";
  private getEbayListedProductsUrl = "MarketPlaces/GetEbayListedItems/";
  private getEbayPresetsUrl="MarketPlaces/GetEbayPresets/"
  private getEbayGlobalMasterDataUrl="MarketPlaces/GetEbayGlobalMasterData";
  private getEbayShippingServiceDataUrl="MarketPlaces/getEbayShippingServices/";
  private getEbayShippingLocationsDataUrl="MarketPlaces/GetEbayShippingLocations";
  private getEbayPaymentMethodsDataUrl="MarketPlaces/getEbayPaymentMethods";
  private saveUpdateEbayPresetUrl="MarketPlaces/UpdateSaveEbayPreset";
  private getEbayPresetDetailsUrl="Marketplaces/GetPresetByCompanyId/";
  private getCustomAttributesByCompanyIdUrl="Marketplaces/GetCustomAttributesByCompanyId/";
  private getFiltersUrl = "Marketplaces/GetFilters/";

  constructor(private coreService: ApiService) {
  }

  //To get user marketplace regions
  getUserMarketplacesRegions(companyId, globalMarketplaceId) {
    return this.coreService.getData(this.getUserMarketplacesRegionsURL + companyId + "/" + globalMarketplaceId, null);
  }

  getEbayPresetDetails(companyId,globalMarketplaceId){
  return this.coreService.getData(this.getEbayPresetDetailsUrl + companyId + "/" + globalMarketplaceId, null);
  }
  //To get eBay Categories
  geteBayCategoryByCategoryId(categoryId) {
    return this.coreService.getData(this.geteBayCategoryByCategoryIdURL + categoryId, null);
  }

  //To get eBay ListingStyle
  geteBayListingStyle() {
    return this.coreService.getData(this.geteBayListingStyleURL, null);
  }

  //To get eBay ListingDuration
  geteBayListingDuration() {
    return this.coreService.getData(this.geteBayListingDurationURL, null);
  }

   //To get eBay ListingCondition
   geteBayCondition() {
    return this.coreService.getData(this.geteBayConditionURL, null);
  }
  

  //To get eBay Aspects
  geteBayCategoryAspects(categoryId) {
    return this.coreService.getData(this.geteBayCategoryAspectsURL + categoryId, null);
  }

  //To get attributes
  getCustomAttributes(companyId: number) {
    return this.coreService.getData(this.getCustomAttributesURL + companyId, null);
  }

   //To get attributes
   getCustomAttributesByCompanyId(companyId: number) {
    return this.coreService.getData(this.getCustomAttributesByCompanyIdUrl + companyId, null);
  }
  //To get listing profile
  geteBayListingProfile(inventoryId: number, companyId: number) {
    return this.coreService.getData(this.geteBayListingProfileURL + inventoryId + "/" + companyId, null);
  }

  //To save or update listing profile
  saveUpdateeBayListingProfile(postData) {
    return this.coreService.postData(this.saveUpdateeBayListingProfileURL, postData, null);
  }

  //To create eBay inventory listing
  createeBayInventoryListing(postData) {
    return this.coreService.postData(this.createeBayInventoryListingURL, postData, null);
  }

  //To get products listed on Ebay
  getEbayListedProducts(marketPlaceId){
    return this.coreService.getData(this.getEbayListedProductsUrl+marketPlaceId,null);
  }

  //TO get Ebay presets
  getEbayPresets(companyId,globalMartketPlaceSiteCode){
   return this.coreService.getData(this.getEbayPresetsUrl+companyId+'/'+globalMartketPlaceSiteCode,null);
  }

  //To Get Ebay global master data for presets
  getEbayGlobalMasterData(){
    return this.coreService.getData(this.getEbayGlobalMasterDataUrl,null);
  }

  //To Get Ebay global master data for presets
  getEbayShippingServicesData(shippinTypeId){
    return this.coreService.getData(this.getEbayShippingServiceDataUrl+shippinTypeId,null);
  }
  //To Get Ebay global master data for presets
  getEbayShippingLocationData(){
    return this.coreService.getData(this.getEbayShippingLocationsDataUrl,null);
  }
  //To Get Ebay global master data for presets
  getEbayPaymentMethodsData(){
    return this.coreService.getData(this.getEbayPaymentMethodsDataUrl,null);
  }
   //To save or update Ebay preset
   saveUpdateeBayPreset(postData) {
    return this.coreService.postData(this.saveUpdateEbayPresetUrl, postData, null);
  }

  //To get filters
  getFilters(companyId: number) {
    return this.coreService.getData(this.getFiltersUrl+ companyId, null);
  }

}
