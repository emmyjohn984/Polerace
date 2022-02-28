import { Injectable } from '@angular/core';
import { ApiService } from 'libs/core-services/src';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})

export class CommonService {

  private getContriesURL = "Account/GetCountries";
  private getStatesByCountryIdURL = "Account/GetStates/";
  private getCurrenciesURL = "Account/GetCurrencies";
  private checkMarketplaceConfiguredUrl = "Account/CheckMarketplaceConfigured/";

  constructor(private coreService: ApiService) {
  }

  getCurrencies() {
    return this.coreService.getData(environment.apiUrl+this.getCurrenciesURL, null);
  }
  //To get roles
  getCountries() {
    return this.coreService.getData(environment.apiUrl+this.getContriesURL, null);
  }

  //To create or update user
  getstates(countryId) {
    return this.coreService.getData(environment.apiUrl+this.getStatesByCountryIdURL + countryId, null);
  }

  checkMarketplaceConfigured(companyID: number) {
    return this.coreService.getData(environment.apiUrl+this.checkMarketplaceConfiguredUrl + companyID, null);
  }

}
