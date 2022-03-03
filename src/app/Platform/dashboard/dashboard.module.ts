import { NgModule ,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CoreServicesModule } from 'libs/core-services/src';
import { StaffDashboardComponent } from './components/staff-dashboard/staff-dashboard.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [StaffDashboardComponent],
  imports: [
    DashboardRoutingModule,
    CoreServicesModule,
    CommonModule,

  ],
  providers: [],
  exports: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class DashboardModule { }
