import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersRountingModule } from './orders.routing';

import { AddOrderComponent } from './add-order/add-order.component';
import { OrderListingComponent } from './order-listing/order-listing.component';
import { ViewOrderComponent } from './view-order/view-order.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddOrderComponent, OrderListingComponent, ViewOrderComponent],
  imports: [
    CommonModule,
    OrdersRountingModule,
    SharedModule
     ]
})
export class OrdersModule { }
