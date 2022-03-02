import { Injectable } from '@angular/core';
import { ApiService } from 'libs/core-services/src';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private coreService:ApiService) { }

private purchaseOrderURL="Marketplaces/AddUpdateProductPurchaseOrders";  
private getPurchaseOrders="Marketplaces/GetProductPurchaseOrdersData/";
private deleteProductOrdersByURL="Marketplaces/DeleteProductPurchaseOrdersById/";
private GetProductOrdersURL= "Marketplaces/GetProductPurchaseOrdersById/";


getPurchaseOrdersById(orderId:number){
  return this.coreService.getData(environment.apiUrl+this.GetProductOrdersURL+orderId,null);
}

deleteOrderById(orderId:number){
  return this.coreService.deleteData(environment.apiUrl+this.deleteProductOrdersByURL+orderId,null,null)
}

getPurchaseOrder(companyID:number){
  return this.coreService.getData(environment.apiUrl+this.getPurchaseOrders+companyID,null)
}

addPurchaseOrder(postData){
  return this.coreService.postData(environment.apiUrl+this.purchaseOrderURL,postData,null)
}

}
