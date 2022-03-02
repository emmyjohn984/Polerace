import { Injectable } from '@angular/core';
import { ApiService } from 'libs/core-services/src';

@Injectable({
  providedIn: 'root'
})
export class AmazonOrdersService {
  private getFilteredAmazonOrdersUrl = "AmazonListing/GetFilteredAmazonOrders/";
  private deleteCustomerUrl = "Marketplaces/deletecustomer/";
  private addOrUpdateCustomerUrl = "Marketplaces/AddUpdateCustomer";
  private BlockUnblockCustomerurl = "Marketplaces/BlockUnblockCustomer/";
  private getAmazonOrderDetailUrl = "AmazonListing/GetAmazonOrderDetails/";
  private deleteAmazonOrderUrl = "AmazonListing/DeleteAmazonOrder/";

  constructor(private coreService: ApiService) {
  }

  deleteAmazonOrder(orderId) {
    return this.coreService.postData(this.deleteAmazonOrderUrl + orderId, null, null);
  }

  deleteCustomer(customerId) {
    return this.coreService.postData(this.deleteCustomerUrl + customerId, null, null);
  }

  getAmazonOrderDetails(orderId) {
    return this.coreService.getData(this.getAmazonOrderDetailUrl + orderId, null);
  }

  addUpdateCustomer(payload) {
    return this.coreService.postData(this.addOrUpdateCustomerUrl, payload, null);
  }
  getFilteredAmazonOrders(payload) {
    return this.coreService.postData(this.getFilteredAmazonOrdersUrl, payload, null);
  }

  blockUnblockCustomer(customerId, value) {
    return this.coreService.postData(this.BlockUnblockCustomerurl + customerId + '/' + value, null, null);
  }

}
