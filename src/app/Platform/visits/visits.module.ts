import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitsRoutingModule } from './visits-routing.module';
import { SearchVisitsComponent } from './components/search-visits/search-visits.component';
import { AddVisitsComponent } from './components/add-visits/add-visits.component';
import { EditVisitsComponent } from './components/edit-visits/edit-visits.component';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ButtonModule} from 'primeng/button';
import {InputMaskModule} from 'primeng/inputmask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import {PanelModule} from 'primeng/panel';
import {CardModule} from 'primeng/card';
import {CalendarModule} from 'primeng/calendar';
import {RadioButtonModule} from 'primeng/radiobutton';
import {CheckboxModule} from 'primeng/checkbox';
import {TableModule} from 'primeng/table';
import {AutoCompleteModule} from 'primeng/autocomplete';


import { CommonUiModule } from 'libs/common-ui/src';
import { CoreServicesModule } from 'libs/core-services/src';
import { CustomDirectivesValidationsModule } from 'libs/custom-directives-validations/src';

@NgModule({
  declarations: [SearchVisitsComponent, AddVisitsComponent, EditVisitsComponent],
  imports: [
    CommonModule,
    VisitsRoutingModule,
    MatInputModule,
    MatCardModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    InputTextModule,
    DropdownModule,
    InputTextareaModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputMaskModule,
    CommonUiModule,
    CoreServicesModule,
    CustomDirectivesValidationsModule,
    //primeng
    PanelModule,
    CardModule,
    CalendarModule,
    RadioButtonModule,
    CheckboxModule,
    TableModule,
    AutoCompleteModule,

  ],
  entryComponents: [EditVisitsComponent],
  providers: []
})
export class VisitsModule { }
