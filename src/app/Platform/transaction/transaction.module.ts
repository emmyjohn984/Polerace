import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionRoutingModule } from './transaction-routing.module';
import { SubscriptionHistoryComponent } from './components/subscription-history/subscription-history.component';
import { ViewsubscriptionhistoryComponent } from './components/viewsubscriptionhistory/viewsubscriptionhistory.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SubscriptionHistoryComponent, ViewsubscriptionhistoryComponent],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    SharedModule,
  ]
})
export class TransactionModule { }
