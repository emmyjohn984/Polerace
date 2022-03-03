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
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SubscriptionHistoryComponent, ViewsubscriptionhistoryComponent],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    SharedModule,
    NgxStripeModule,
  ]
})
export class TransactionModule { }
