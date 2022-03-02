import { Injectable } from '@angular/core';
import { ApiService } from 'libs/core-services/src';
import { environment } from 'src/environments/environment';
import { eBayAuthorizeCode } from '../models/eBayAuthorizeCode';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MarketplacesService {
  private geteBaySessionIDURL = "Marketplaces/GeteBaySessionID";
  private geteBayAccessTokenURL = "Marketplaces/GeteBayAccessToken/";
  private connecteBayForAuthorizationURL = "Marketplaces/ConnecteBayForAuthorization";
  private geteBayOAuthAccessTokenURL = "Marketplaces/GeteBayOAuthAccessToken";
  private getGlobalMarketplaceLocaleByChannelIDURL = "Marketplaces/GetGlobalMarketplaceLocaleByChannelID/";
  private createUpdateMarketplaceURL = "Marketplaces/CreateUpdateMarketplace";
  private getUserMarketplacesURL = "Marketplaces/GetUserMarketplaces/";
  private geteBayOAuthRefreshTokenURL = "Marketplaces/GeteBayOAuthRefreshToken/";
  private deleteUserMarketplaceURL = "Marketplaces/DeleteUserMarketplace/";
  private validateAmazonSellerDetailsURL = "Marketplaces/ValidateAmazonSellerDetails";
  private getSalesTaxesURL = "Taxes/GetSalesTaxes/";
  private addUpdateSalesTaxURL = "Taxes/AddUpdateSalesTax";
  private getAmazonGlobalMarketplacesByChannelIDURL = "Marketplaces/GetAmazonGlobalMarketplacesByChannelID/";
  private addWalmartDetailsUrl = "Marketplaces/AddWalmartDetails";
  private addFiltersUrl = "Marketplaces/AddUpdateFilters";
  private getFiltersByIdUrl = "Marketplaces/GetFiltersById/";
  private getMasterApplicationFieldsUrl = "Marketplaces/GetMasterApplicationFields";
  private getMarketplacesFieldsUrl = "Marketplaces/GetMarketplacesFields/";
  private addUpdateMarketplaceMappingFieldsURL = "Marketplaces/AddUpdateMarketplaceMappingFields";
  private getMarketplacesMappedFieldsUrl = "Marketplaces/getMarketplacesMappedFields/";
  private getGlobalMarketPlaceURL = "Marketplaces/GetGlobalMarketplaceDataById/";
  private getAllGlobalMarketPlaceURL = "Marketplaces/GetGlobalMarketplaceData";
  private getAllGlobalMarketplaceSiteURL =  "Marketplaces/GetGlobalMarketplaceSiteData";
  private getAllUserMarketPlaceURL = "Marketplaces/GetUserMarketplacesData";
  private getUserMarketPlaceURL = "Marketplaces/GetUserMarketplacesById/";
  private getOrdersRecivedFromDiffrentMarketPlaces = "Marketplaces/OrderReceivedFromDifferentMarketPlace/"
  private getOrderDetailOfSaleChannels = "Marketplaces/OrderReceivedFromDifferentMarketPlaceById/"
  private updateStatusOrderOnSelection = "Marketplaces/UpdateStatusShippedOnSelection"
  private exportOrderData = "Marketplaces/OrderReceivedFromDifferentMarketPlaceExport"
  private getSaleStats = "Marketplaces/GetSalesStatsFromDifferentMarketAmount/";


  constructor(private coreService: ApiService,private http:HttpClient) {
  }

  //To get eBay session ID
  geteBaySessionID() {
    return this.coreService.getData(environment.apiUrl +this.geteBaySessionIDURL, null);
  }

  //To get eBay access token
  geteBayAccessToken(eBaySessionID) {
    return this.coreService.getData(environment.apiUrl +this.geteBayAccessTokenURL + eBaySessionID, null);
  }

  addWalmartDetails(payload) {
    return this.coreService.postData(environment.apiUrl +this.addWalmartDetailsUrl, payload, null);
  }

  //To connect eBay for OAuth authorization
  connecteBayForAuthorization() {
    return this.coreService.getData(environment.apiUrl +this.connecteBayForAuthorizationURL, null);
  }

  //To get eBay OAuth access token
  geteBayOAuthAccessToken(postData: eBayAuthorizeCode) {
    return this.coreService.postData(environment.apiUrl +this.geteBayOAuthAccessTokenURL, postData, null);
  }

  //To get eBay marketplace locale
  getGlobalMarketplaceLocaleByChannelID(channelID: number) {
    return this.coreService.getData(environment.apiUrl +this.getGlobalMarketplaceLocaleByChannelIDURL + channelID, null);
  }

  //To create/update Marketplace
  createUpdateMarketplace(postData) {
    return this.coreService.postData(environment.apiUrl +this.createUpdateMarketplaceURL, postData, null);
  }

  //To get user marketplaces
  getUserMarketplaces(companyID: number) {
    return this.coreService.getData(environment.apiUrl +this.getUserMarketplacesURL + companyID, null);
  }

  //To get user marketplaces
  GeteBayOAuthRefreshToken(id: number) {
    return this.coreService.getData(environment.apiUrl +this.geteBayOAuthRefreshTokenURL + id, null);
  }

  //To delete user marketplaces
  deleteUserMarketplace(userMarketplaceId: number) {
    return this.coreService.deleteData(environment.apiUrl + this.deleteUserMarketplaceURL + userMarketplaceId,null,null);
  }

  //To get sales taxes
  getSalesTaxes(companyID: number) {
    return this.coreService.getData(environment.apiUrl +this.getSalesTaxesURL + companyID, null);
  }

  //To verify Amazon seller details
  validateAmazonSellerDetails(postdata) {
    return this.coreService.postData(environment.apiUrl +this.validateAmazonSellerDetailsURL,  postdata, null);
  }

  //To add/update sales tax
  addUpdateSalesTax(postdata) {
    return this.coreService.postData(environment.apiUrl +this.addUpdateSalesTaxURL, postdata, null);
  }

  //To get amazon marketplace regions
  getAmazonGlobalMarketplacesByChannelID(channelID: number) {
    return this.coreService.getData(environment.apiUrl +this.getAmazonGlobalMarketplacesByChannelIDURL + channelID, null);
  }

  //To add filters
  addFilters(postdata) {
    return this.coreService.postData(environment.apiUrl +this.addFiltersUrl, postdata, null);
  }

  //To get filters by ID
  getFiltersById(filterId: number) {
    return this.coreService.getData(environment.apiUrl +this.getFiltersByIdUrl + filterId, null);
  }

  // To get Product Application Fields.
  getMasterApplicationFields() {
    return this.coreService.getData(environment.apiUrl +this.getMasterApplicationFieldsUrl, null);
  }

  // To get Global Marketplace Fields
  getMarketplacesFields(globalMarketplaceId: number) {
    return this.coreService.getData(environment.apiUrl +this.getMarketplacesFieldsUrl + globalMarketplaceId, null);
  }

  //To create/update mapping Fields
  addUpdateMarketplaceMappingFields(postData) {
    return this.coreService.postData(environment.apiUrl +this.addUpdateMarketplaceMappingFieldsURL, postData, null);
  }

  // To get Global Marketplace Fields
  getMarketplacesMappedFields(companyId: number) {
    return this.coreService.getData(environment.apiUrl +this.getMarketplacesMappedFieldsUrl + companyId, null);
  }

  // TO get GlobalMarketPlace
  getGlobalMarketPlace(globalMarketplaceId:number){
    return this.coreService.getData(environment.apiUrl +this.getGlobalMarketPlaceURL + globalMarketplaceId, null);
  }

  // To get All GlobalMarketPlace
  getAllGlobalMarketPlace(){
    return this.coreService.getData(environment.apiUrl +this.getAllGlobalMarketPlaceURL , null);
  }

  // To get All GlobalMarketplaceSiteData
  getAllGlobalMarketplaceSiteData(){
    return this.coreService.getData(environment.apiUrl + this.getAllGlobalMarketplaceSiteURL, null);
  }

  // To get ALL UserMarketplace
  getAllUserMarketPlace(){
    return this.coreService.getData(environment.apiUrl + this.getAllUserMarketPlaceURL, null);
  }

  getUserMarketPlace(userMarketplaceId:number){
    return this.coreService.getData(environment.apiUrl+ this.getUserMarketPlaceURL +userMarketplaceId,null)
  }

  // to get list of orders from diffrent marketplaces
  getOrdersFromDiffrentMarketPlaces(param){
    return this.coreService.getData(environment.apiUrl + this.getOrdersRecivedFromDiffrentMarketPlaces,param);
  }

  getAllOrdersFromDiffrentMarketPlaces(param:any){
    return this.coreService.getData(environment.apiUrl + this.getOrdersRecivedFromDiffrentMarketPlaces,param);
  }

  // get order details by sale channel
  getOrderDetailsFromDiffrentChannel(globalMarketplaceId:number,orderId:number){
    return this.coreService.getData(environment.apiUrl + this.getOrderDetailOfSaleChannels + globalMarketplaceId + '/' + orderId , null);
  }

  // update status of orders on selection
  updateStatusOrder(main:any){
    return this.coreService.postData(environment.apiUrl + this.updateStatusOrderOnSelection ,main,null);
  }

  exportOrdersFromDiffrentMarketPlaces(param:any){
    return this.coreService.getData(environment.apiUrl + this.exportOrderData,param);
  }

  getStatistics(companyid){
    return this.coreService.getData(environment.apiUrl + this.getSaleStats + companyid,null);
  }

}

