import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../.././src/app/auth/auth-gaurd';
import { OrderListingComponent } from './order-listing/order-listing.component';
import { AddOrderComponent } from './add-order/add-order.component';
import { ViewOrderComponent } from './view-order/view-order.component';

const routes: Routes = [
  {
    path: 'order-listing',
    component: OrderListingComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'add-order',
    component: AddOrderComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'view-order',
    component: ViewOrderComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRountingModule {}
