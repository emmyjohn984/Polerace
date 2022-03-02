import { Injectable } from '@angular/core';
import { ApiService } from 'libs/core-services/src';

@Injectable({
    providedIn: 'root'
})

export class WalmartOrdersService {
    private getWalmartFilteredOrdersURL = "WalmartListing/GetWalmartFilteredOrders";
    private deleteWalmartOrderURL = "WalmartListing/DeleteWalmartOrder/";

    constructor(private coreService: ApiService) {
    }

    getWalmartFilteredOrders(payload) {
        return this.coreService.postData(this.getWalmartFilteredOrdersURL, payload, null);
    }

    deleteWalmartOrder(walmartOrderId) {
        return this.coreService.postData(this.deleteWalmartOrderURL + walmartOrderId, null, null);
    }

}
