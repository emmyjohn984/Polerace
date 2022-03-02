import { Injectable } from '@angular/core';
import { ApiService } from 'libs/core-services/src';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private getCustomersUrl = "Marketplaces/GetCustomerDataList/";
  private deleteCustomerUrl="Marketplaces/deletecustomer/";
  private addOrUpdateCustomerUrl = "Marketplaces/AddUpdateCustomer";
  private getCustomerUrl="Marketplaces/GetCustomerById/";
  private getFilteredCustomersUrl = "Marketplaces/GetFilteredCustomers";
  private BlockUnblockCustomerurl = "Marketplaces/BlockUnblockCustomer/";
  private GetCustomerDataListURL = "MarketPlaces/GetCustomerDataList/";
  public sendEmails = "Account/SendEmails";
  public viewCustomer ="Marketplaces/GetCustomerById/"

  constructor(private coreService: ApiService) {
  }

  GetCustomerDataList(companyId){
    return this.coreService.getData(environment.apiUrl+this.GetCustomerDataListURL+ companyId,null)
  }

  GetCustomerData(customerId){
    return this.coreService.getData(environment.apiUrl+this.viewCustomer+ customerId,null)
  }
  sendEmail(email) {
      return this.coreService.postData(environment.apiUrl+this.sendEmails,email,null);
  }

  //To get eBay session ID
  getCustomersByCompany(companyId) {
    return this.coreService.getData(environment.apiUrl+this.getCustomersUrl+companyId, null);
  }

  deleteCustomer(customerId) {
  return this.coreService.postData(environment.apiUrl+this.deleteCustomerUrl+customerId,null,null);
}
    getCustomer(customerId) {
    return this.coreService.getData(environment.apiUrl+this.getCustomerUrl+customerId, null);
  }

  addUpdateCustomer(payload) {
    return this.coreService.postData(environment.apiUrl+this.addOrUpdateCustomerUrl,payload,null);
  }
  getFilteredCustomers(payload){
    return this.coreService.postData(environment.apiUrl+this.getFilteredCustomersUrl,payload,null);
  }

  blockUnblockCustomer(customerId,value){
    return this.coreService.postData(environment.apiUrl+this.BlockUnblockCustomerurl+customerId+'/'+value,null,null);
  }

}
