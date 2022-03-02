import { Injectable } from '@angular/core';
import { ApiService } from 'libs/core-services/src';

@Injectable({
    providedIn: 'root'
})

export class eBayOrdersService {
    private geteBayFilteredOrdersURL = "Marketplaces/GeteBayFilteredOrders";
    private deleteeBayOrderURL = "Marketplaces/DeleteeBayOrder/";

    constructor(private coreService: ApiService) {
    }

    geteBayFilteredOrders(payload) {
        return this.coreService.postData(this.geteBayFilteredOrdersURL, payload, null);
    }

    deleteeBayOrder(orderID) {
        return this.coreService.postData(this.deleteeBayOrderURL + orderID, null, null);
    }

}
