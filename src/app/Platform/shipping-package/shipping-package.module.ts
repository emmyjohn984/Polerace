import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShippingPackageRoutingModule } from './shipping-package-routing.module';
import { CreateShippingPackageComponent } from './component/create-shipping-package/create-shipping-package.component';
import { ProgressSpinnerModule } from 'src/app/shared/progress-spinner/progress-spinner/progress-spinner.module';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { ManageShippingPackageComponent } from './component/manage-shipping-package/manage-shipping-package.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [CreateShippingPackageComponent, ManageShippingPackageComponent],
  imports: [
    CommonModule,
    ShippingPackageRoutingModule,
    SharedModule,
    ProgressSpinnerModule
  ]
})
export class ShippingPackageModule { }
