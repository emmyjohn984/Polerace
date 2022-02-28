import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchVisitsComponent } from './components/search-visits/search-visits.component';
import { AddVisitsComponent } from './components/add-visits/add-visits.component';


const routes: Routes = [
  {
    path: '',
    component: SearchVisitsComponent
  },
  {
    path: 'add',
    component:AddVisitsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitsRoutingModule {}
