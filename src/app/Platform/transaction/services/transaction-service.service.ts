import { Injectable } from '@angular/core';
import { ApiService } from 'libs/core-services/src';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionServiceService {

  private subscriptionHistoryUrl = "TransactionHistory/SubscriptionHistoryList/";
  private subscriptionHistoryByUserId = "TransactionHistory/ViewSubscriptionHistoryDetail"

  constructor(private coreService:ApiService) { }


  // To Get Subscription History
  getSubscriptionHistory(param:any){
    return this.coreService.getData(environment.apiUrl+this.subscriptionHistoryUrl,param);
  }

  // To Get Subscription History Details By User Id
  getSubscriptionHistoryByUserId(param){
    return this.coreService.getData(environment.apiUrl+this.subscriptionHistoryByUserId,param)
  }

}
