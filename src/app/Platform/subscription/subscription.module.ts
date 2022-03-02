import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SubscriptionListingComponent } from './components/subscription-listing/subscription-listing.component';
import { TableModule } from 'primeng/table';
import { AddSubscriptionPlanComponent } from './components/add-subscription-plan/add-subscription-plan.component';
import  {MatFormFieldModule } from '@angular/material/form-field';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [SubscriptionListingComponent, AddSubscriptionPlanComponent],
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    TableModule,
    MatFormFieldModule,
    InputSwitchModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatListModule,
    TooltipModule
  ]
})
export class SubscriptionModule { }
