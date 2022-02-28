import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'dnd-evv-validation-summary',
  templateUrl: './validation-summary.component.html',
  styleUrls: ['./validation-summary.component.scss']
})
export class ValidationSummaryComponent implements OnInit {

  @Input() form: FormGroup;
  errors: string[] = [];

  constructor() { }

  ngOnInit() {
    if (this.form instanceof FormGroup === false) {
    throw new Error('You must supply the validation summary with an NgForm.');
  }
  this.form.valueChanges.subscribe(status => {
    this.resetErrorMessages();
    this.generateErrorMessages(this.form);
  });
  }

   resetErrorMessages() {
  this.errors.length = 0;
  }

  generateErrorMessages(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.controls[controlName];
      const errors = control.errors;

      if (errors === null || errors.count === 0) {
        return;
      }
      // Handle the 'required' case
      if (errors.required) {
        this.errors.push(`${controlName} is required`);
      }
      // Handle 'minlength' case
      if (errors.minlength) {
        this.errors.push(`${controlName} minimum length is ${errors.minlength.requiredLength}.`);
      }
      // Handle custom messages.
      if (errors.invalidClockOut) {
        this.errors.push(`${controlName} ${errors.message}`);
      }
      if (errors.dateTimeInvalid) {
        this.errors.push(`${controlName} ${errors.message}`);
      }
    });
  }

}
