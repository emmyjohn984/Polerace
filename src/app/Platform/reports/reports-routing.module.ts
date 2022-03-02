import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketPlacesProfitListComponent } from './components/market-places-profit-list/market-places-profit-list.component';
import { ProfitListComponent } from './components/profit-list/profit-list.component';

const routes: Routes = [
        {
          path: 'profit-list',
          component: ProfitListComponent
        },
        {
          path: 'market-places-profit-list',
          component: MarketPlacesProfitListComponent
        }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
