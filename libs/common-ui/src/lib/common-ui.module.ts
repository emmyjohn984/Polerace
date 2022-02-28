import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {InputTextModule} from 'primeng/inputtext';
import { MaskedDatetimeInputComponent } from './masked-datetime-input/masked-datetime-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidationSummaryComponent } from './validation-summary/validation-summary/validation-summary.component';

@NgModule({
  imports: [CommonModule, InputTextModule, FormsModule, ReactiveFormsModule],
  declarations: [HeaderComponent, SidebarComponent, MaskedDatetimeInputComponent, ValidationSummaryComponent],
  exports: [HeaderComponent, SidebarComponent, MaskedDatetimeInputComponent, ValidationSummaryComponent]
})
export class CommonUiModule {}
