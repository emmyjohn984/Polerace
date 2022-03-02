import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateShippingPackageComponent } from './component/create-shipping-package/create-shipping-package.component';
import { ManageShippingPackageComponent } from './component/manage-shipping-package/manage-shipping-package.component';


const routes: Routes = [
        {
          path: 'add-package',
          component: CreateShippingPackageComponent
        },
           {
          path: 'edit-package/:id',
          component: CreateShippingPackageComponent
        },
        {
          path: '',
          component: ManageShippingPackageComponent
        }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingPackageRoutingModule { }
