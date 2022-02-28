import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth-gaurd';
import { MainComponent } from 'src/app/shared/layout/main/main.component';
import { SubscriptionHistoryComponent } from './components/subscription-history/subscription-history.component';
import { ViewsubscriptionhistoryComponent } from './components/viewsubscriptionhistory/viewsubscriptionhistory.component';


const routes: Routes = [

  {
    path:'',
    component: MainComponent,
    canActivate:[AuthGuard],
    children:
    [
      {
        path:'subscription-history-list',component:SubscriptionHistoryComponent,canActivate:[AuthGuard]
      },
      {
        path:'view-subscription-history',component:ViewsubscriptionhistoryComponent,canActivate:[AuthGuard]
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
