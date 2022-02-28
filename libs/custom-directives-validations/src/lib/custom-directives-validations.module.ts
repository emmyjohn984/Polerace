import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTimeValidationDirective } from './date-time-validation/date-time-validation.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [DateTimeValidationDirective],
  exports: [DateTimeValidationDirective]
})
export class CustomDirectivesValidationsModule {}
