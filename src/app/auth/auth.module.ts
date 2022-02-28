import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Libraries import

import { AuthRoutingModule } from './auth-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoreServicesModule } from 'libs/core-services/src';
import { HttpClient } from '@angular/common/http';
import { MultiTranslateHttpLoader } from './service/multi-translate-loader';


@NgModule({
  declarations: [],
  imports: [//BrowserModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CoreServicesModule,
    //RouterModule,

  ],

  providers: [],
  exports: []
})
export class AuthModule { }
