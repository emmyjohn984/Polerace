import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsRoutingModule } from './reports-routing.module';
import { ProfitListComponent } from './components/profit-list/profit-list.component';
import { MarketPlacesProfitListComponent } from './components/market-places-profit-list/market-places-profit-list.component';
import { ReportsService } from './services/reports.service';
import {DropdownModule} from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule} from 'primeng/inputtext';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ProfitListComponent, MarketPlacesProfitListComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule
  ],
  providers:[ReportsService]
})
export class ReportsModule { }
