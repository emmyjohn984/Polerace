import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SubscriptionListingComponent } from './components/subscription-listing/subscription-listing.component';
import { AddSubscriptionPlanComponent } from './components/add-subscription-plan/add-subscription-plan.component';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SubscriptionListingComponent, AddSubscriptionPlanComponent],
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    SharedModule,
  ]
})
export class SubscriptionModule { }
