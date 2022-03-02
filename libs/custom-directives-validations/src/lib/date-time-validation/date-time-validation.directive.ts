import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import * as moment from 'moment/moment.js';

@Directive({
  selector: '[dndEvvDateTimeValidation]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: DateTimeValidationDirective,
    multi: true
  }]
})
export class DateTimeValidationDirective implements Validator {
  validate(control: AbstractControl) : {[key: string]: any} | null {
    const date = moment(control.value, 'MM/DD/YYYY HH:mm a');
    if (control.value && !date.isValid())  {
      return { 'dateTimeInvalid': true }; // return object if the validation is not passed.
    }
    return null; // return null if validation is passed.
  }
}
