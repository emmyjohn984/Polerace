import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth-gaurd';
import { MainComponent } from 'src/app/shared/layout/main/main.component';
import { MarketPlacesProfitListComponent } from './components/market-places-profit-list/market-places-profit-list.component';
import { ProfitListComponent } from './components/profit-list/profit-list.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children:
      [
        {
          path: 'profit-list',
          component: ProfitListComponent
        },
        {
          path: 'market-places-profit-list',
          component: MarketPlacesProfitListComponent
        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
