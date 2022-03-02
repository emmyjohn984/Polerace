import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import * as moment from 'moment/moment.js';

@Injectable({
  providedIn: 'root'
})
export class GlobalSharedService {

  constructor() { }

  calculateClockDifference(clockInValue: any, clockOutValue: any) {
    if (clockInValue && clockOutValue) {
      const clockInTime = new Date(clockInValue);
      const clockOutTime = new Date(clockOutValue);
      let diff = (clockOutTime.getTime() - clockInTime.getTime()) / 1000;
      return diff /= (60 * 60); // calculate difference in hours
    }
  }

  validateDateTime(control: AbstractControl): { [key: string]: any } | null {
    const date = moment(control.value);
    if (control.value && !date.isValid()) {
      return { 'dateTimeInvalid': true,
               'message': 'Invalid Date/Time'
             }; // return object if the validation is not passed.
    }
    return null; // return null if validation is passed.
  }

  clockOutValidator(fg: FormGroup) {
    const clockIn = moment(fg.get('ClockIn').value);
    const clockOut = moment(fg.get('ClockOut').value);
    if (clockIn.isValid() && clockOut.isValid()) {
      return clockOut > clockIn
        ? null : { 'invalidClockOut': true,
                   'message': 'ClockOut must be greater than ClockIn'
         };
    } else {
      return { 'invalidClockOut': true,
                'message': 'ClockOut must be greater than ClockIn'};
    }

  };
}
