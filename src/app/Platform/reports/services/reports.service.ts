import { Injectable } from '@angular/core';
import { ApiService } from 'libs/core-services/src';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private getProfitListUrl = 'Reports/GetProductProfitList';
  private getMarketPlacesProfitListUrl = 'Reports/GetProductWithMarketPlacesProfitList'
  constructor(private coreService: ApiService) { }

  getProfitList(params: any) {
    return this.coreService.getData(
      environment.apiUrl + this.getProfitListUrl ,params
      
    );
  }

  getMarketPlacesProfitList(params: any) {
    return this.coreService.getData(
      environment.apiUrl + this.getMarketPlacesProfitListUrl ,params
    );
  } 
}
