import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth-gaurd';
import { MainComponent } from 'src/app/shared/layout/main/main.component';
import { AddSubscriptionPlanComponent } from './components/add-subscription-plan/add-subscription-plan.component';
import { SubscriptionListingComponent } from './components/subscription-listing/subscription-listing.component';


const routes: Routes = [

  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children:
      [
        {
          path: 'subscription-listing', component: SubscriptionListingComponent,canActivate:[AuthGuard]
        },
        {
          path: 'add-subscription', component: AddSubscriptionPlanComponent, canActivate:[AuthGuard]
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionRoutingModule { }
