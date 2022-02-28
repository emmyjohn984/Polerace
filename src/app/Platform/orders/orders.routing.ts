import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AmazonOrdersListingComponent } from './amazon/components/amazon-orders-listing.component';
import { AmazonOrderDetails } from './amazon/order-details-components/amazon-order-details.component';
import { MainComponent } from '../../../.././src/app/shared/layout/main/main.component';
import {AuthGuard} from '../../../.././src/app/auth/auth-gaurd'
  import { from } from 'rxjs';
import { EbayOrdersListingComponent } from './eBay/components/ebay-orders-listing/ebay-orders-listing.component';
import { WalmartOrdersListingComponent } from './walmart/components/walmart-orders-listing/walmart-orders-listing.component';
import { OrderListingComponent } from './order-listing/order-listing.component';
import { AddOrderComponent } from './add-order/add-order.component';
import { ViewOrderComponent } from './view-order/view-order.component';


const routes: Routes =
  [
    {
      path: '',
      component: MainComponent,
      canActivate: [AuthGuard],
      children:
        [
          {
            path: 'amazonorders', component: AmazonOrdersListingComponent, pathMatch: 'full',canActivate:[AuthGuard]
          },
          {
            path: 'amazonOrder', component: AmazonOrderDetails, pathMatch: 'full',canActivate:[AuthGuard]
          },
          {
            path: 'ebayorders', component: EbayOrdersListingComponent, pathMatch: 'full',canActivate:[AuthGuard]
          }
          ,
          {
            path: 'walmartorders', component: WalmartOrdersListingComponent, pathMatch: 'full',canActivate:[AuthGuard]
          },
          {
            path: 'order-listing', component: OrderListingComponent, pathMatch: 'full', canActivate:[AuthGuard]
          },
          {
            path: 'add-order', component: AddOrderComponent, pathMatch: 'full' , canActivate:[AuthGuard]
          },
          {
            path: 'view-order', component: ViewOrderComponent, pathMatch: 'full' , canActivate:[AuthGuard]
          }
        ]
    }
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRountingModule { }
