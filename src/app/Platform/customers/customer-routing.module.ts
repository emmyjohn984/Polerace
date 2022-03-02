import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerListingComponent } from './components/customer-listing.component';
import { MainComponent } from 'src/app/shared/layout/main/main.component';
import {AuthGuard} from 'src/app/auth/auth-gaurd'
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { ManageCustomersComponent } from './components/manage-customers/manage-customers.component';
import { ViewCustomerComponent } from './components/view-customer/view-customer.component';


const routes: Routes =
  [
    // {
    //   path: '',
    //   component: MainComponent,
    //   canActivate: [AuthGuard],
    //   children:
    //     [
          {
            path: 'customerListing', component: CustomerListingComponent, pathMatch: 'full',canActivate:[AuthGuard]
          },
          {
            path: 'amazoncustomerListing', component: CustomerListingComponent, pathMatch: 'full',canActivate:[AuthGuard]
          },
          {
            path: 'viewCustomer/:id', component: ViewCustomerComponent, pathMatch: 'full',canActivate:[AuthGuard]
          },
          {
            path: 'addCustomer', component: AddCustomerComponent, pathMatch: 'full',canActivate:[AuthGuard]
          },
          
          {
            path: 'mangecustomers', component: ManageCustomersComponent, pathMatch: 'full', canActivate:[AuthGuard]
          }
    //     ]
    // }
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }


