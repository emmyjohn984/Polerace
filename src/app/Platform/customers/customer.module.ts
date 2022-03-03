import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';
import {CustomerListingComponent} from './components/customer-listing.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { ManageCustomersComponent } from './components/manage-customers/manage-customers.component';
import { ViewCustomerComponent } from './components/view-customer/view-customer.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CustomerListingComponent,AddCustomerComponent, ManageCustomersComponent, ViewCustomerComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule
  ]
})
export class CustomersModule { }
