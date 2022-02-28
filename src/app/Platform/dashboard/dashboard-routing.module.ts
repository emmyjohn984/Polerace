import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';
import { MainComponent } from 'src/app/shared/layout/main/main.component';
import {AuthGuard} from 'src/app/auth/auth-gaurd'
import { from } from 'rxjs';
import { StaffDashboardComponent } from './components/staff-dashboard/staff-dashboard.component';


const routes: Routes =
  [
    {

      path: '',
      component: MainComponent,
      canActivate: [AuthGuard],
      children:
        [
          {
            path: 'admindashboard', component: DashboardComponent, pathMatch: 'full',canActivate:[AuthGuard]
          },
          {
            path: 'staffdashboard', component: StaffDashboardComponent, pathMatch: 'full',canActivate:[AuthGuard]
          }
        ]
    }
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
