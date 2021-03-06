import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageSellersComponent } from './components/manage-sellers/manage-sellers.component';
import { AddSellerComponent } from './components/add-seller/add-seller.component';
import { AuthGuard } from 'src/app/auth/auth-gaurd';


const routes: Routes = [
        {
          path: 'managesellers',
          component:ManageSellersComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'addseller',
          component: AddSellerComponent,
          canActivate: [AuthGuard]
        }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellersRoutingModule { }
