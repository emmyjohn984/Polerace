import { Injectable } from '@angular/core';
import { ApiService } from 'libs/core-services/src';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShippingPackageService {
  private GetShippingPackageList = "ShippingPackage/GetShippingPackageList/";
  private GetPackageById = "ShippingPackage/GetPackageById?";
  private AddUpdatePackage = "ShippingPackage/AddUpdatePackage";
  private DeletePackageById = "ShippingPackage/DeletePackageById?"


  constructor(private coreService: ApiService) {
  }

  getShippingPackage(packageId: number) {
    return this.coreService.getData(environment.apiUrl + this.GetPackageById + 'PackageId=' + packageId, null);
  }
  getShippingList(param: any) {
    return this.coreService.getData(environment.apiUrl + this.GetShippingPackageList, param);
  }
  createPackage(shippingPackage: any) {
    return this.coreService.postData(environment.apiUrl + this.AddUpdatePackage, shippingPackage, null);
  }

  deletePackage(packageId: number) {
    return this.coreService.deleteData(environment.apiUrl + this.DeletePackageById + 'PackageId=' + packageId, null, null);
  }

}
