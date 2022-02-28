import { Injectable } from '@angular/core';
import { ApiService } from 'libs/core-services/src';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class SellersService {
  private createSellerURL = 'Account/CreateUpdateSellerUser';
  private updateSellerURL = 'Account/CreateUpdateSellerUser';
  private getsellersByCompanyIdUrl = 'Account/GetSellersUserBySellerId/';
  private getsellersByCompanyId = 'Account/GetSellerCompanyByCompanyId/';
  private getsellersUrl = 'Account/GetSellersUserByCompanyId/';
  private deleteSellerURL = 'Account/DeleteSellerUser';

  constructor(private coreService: ApiService) {}

  //To create seller
  createSeller(any) {
    return this.coreService.postData(
      environment.apiUrl + this.createSellerURL,
      any,
      null
    );
  }

  //To update seller
  updateSeller(any) {
    return this.coreService.postData(
      environment.apiUrl + this.updateSellerURL,
      any,
      null
    );
  }

  getSellerByUserId(companyId: any, userId: any) {
    return this.coreService.getData(
      environment.apiUrl +
        this.getsellersByCompanyId +
        companyId +
        '/' +
        userId,
      null
    );
  }

  getSellersByCompanyId(sellerId: any) {
    return this.coreService.getData(
      environment.apiUrl + this.getsellersByCompanyIdUrl + sellerId,
      null
    );
  }

  getSellersForCompanyId(companyId: any) {
    return this.coreService.getData(
      environment.apiUrl + this.getsellersUrl + companyId,
      null
    );
  }

  deleteseller(sellerId: any) {
    return this.coreService.deleteData(
      environment.apiUrl + this.deleteSellerURL + '/' + sellerId,
      null,
      null
    );
  }
}
