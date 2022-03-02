import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxStripeModule } from 'ngx-stripe';
import { TransactionRoutingModule } from './transaction-routing.module';
import { SubscriptionHistoryComponent } from './components/subscription-history/subscription-history.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { ViewsubscriptionhistoryComponent } from './components/viewsubscriptionhistory/viewsubscriptionhistory.component';

@NgModule({
  declarations: [SubscriptionHistoryComponent, ViewsubscriptionhistoryComponent],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    NgxStripeModule,
    FormsModule,
    MultiSelectModule,
    MatSelectModule,
    MatListModule,
    ReactiveFormsModule
  ]
})
export class TransactionModule { }
