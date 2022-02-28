import { BrowserModule } from '@angular/platform-browser';
import { NgModule ,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { RouterModule } from '@angular/router';

// Libraries import
import { DashboardRoutingModule } from './dashboard-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoreServicesModule } from 'libs/core-services/src';
import { MatMenuModule } from '@angular/material/menu';
import { ChartsModule } from 'ng2-charts';
import { Chart } from 'chart.js';
import { ChartModule } from 'primeng';
import { StaffDashboardComponent } from './components/staff-dashboard/staff-dashboard.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [StaffDashboardComponent],
  imports: [
    DashboardRoutingModule,
    CoreServicesModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    ChartsModule,
  ],
  providers: [],
  exports: [ReactiveFormsModule, FormsModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class DashboardModule { }
