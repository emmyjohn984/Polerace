import { Injectable } from '@angular/core';
import { ApiService } from 'libs/core-services/src';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionServiceService {


  private getSubscriptionPlans = "Authentication/GetSubscriptionPlans"
  private createUpdateSubscriptionPlanURL = "Authentication/CreateUpdateSubscription"
  private getSubscriptionPlanByIdUrl = "Authentication/GetSubscriptionPlan/"
  private deleteSubscriptionPlanByIdUrl = "Authentication/DeleteSubscriptionPlan/"
  constructor(private coreService: ApiService) { }


  // To get subscriptioList
  getSubscription(){
    return this.coreService.getData(environment.apiUrl +this.getSubscriptionPlans, null)
  }

  // To create update subscription plans
  createUpdateSubscription(payload){
    return this.coreService.postData(environment.apiUrl + this.createUpdateSubscriptionPlanURL, payload, null )
  }

  // get subscription plan by id
  getSubscriptionById(subscriptionId:number){
    return this.coreService.getData(environment.apiUrl + this.getSubscriptionPlanByIdUrl + subscriptionId, null)
  }

  // delete subscription plan by id
  deleteSubscriptionById(subscriptionId:number){
    return this.coreService.getData(environment.apiUrl + this.deleteSubscriptionPlanByIdUrl + subscriptionId, null)
  }

  //  deleteCategory(categoryID: number) {
  //   return this.coreService.postData(environment.apiUrl +this.deleteCategoryURL + categoryID, null, null);
  // }

}
