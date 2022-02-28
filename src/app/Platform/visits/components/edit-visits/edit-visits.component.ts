import { Component, OnInit } from '@angular/core';
//import { SelectItem } from 'primeng/api/selectitem';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalSharedService } from 'libs/core-services/src';


@Component({
  selector: 'app-edit-visits',
  templateUrl: './edit-visits.component.html',
  styleUrls: ['./edit-visits.component.scss']
})
export class EditVisitsComponent implements OnInit {

  editVisitForm: FormGroup;
  cars: any[];
  isFormSubmitted = false;

  constructor(private fb: FormBuilder, private sharedService: GlobalSharedService) {
    this.editVisitForm = this.fb.group({
      'Id': null,
      'EmployeeName': [null, Validators.required],
      'EmployeeId': [null, Validators.required],
      'JobName': [null, Validators.required],
      'JobId': [null, Validators.required],
      'ClockIn': [null, [Validators.required, sharedService.validateDateTime]],
      'ClockOut': [null, [Validators.required, sharedService.validateDateTime]],
      'ClockDifference': [null, Validators.required],
      'ActivityCode': [null, Validators.required],
      'Authorization': [null, Validators.required],
      'BillingCode': [null, Validators.required],
      'ReasonCode': [null, Validators.required],
      'Notes': [null, Validators.required],
    }, {validator: sharedService.clockOutValidator})

    this.editVisitForm.controls['ClockIn'].valueChanges.subscribe((selectedValue) => {
      this.calculateClockDifference(selectedValue, this.editVisitForm.get('ClockOut').value)
    })

    this.editVisitForm.controls['ClockOut'].valueChanges.subscribe((selectedValue) => {
      this.calculateClockDifference(this.editVisitForm.get('ClockIn').value, selectedValue)
    })

    this.cars = [
      { label: 'Audi', value: 'Audi' },
      { label: 'BMW', value: 'BMW' },
      { label: 'Fiat', value: 'Fiat' },
      { label: 'Ford', value: 'Ford' },
      { label: 'Honda', value: 'Honda' },
      { label: 'Jaguar', value: 'Jaguar' },
      { label: 'Mercedes', value: 'Mercedes' },
      { label: 'Renault', value: 'Renault' },
      { label: 'VW', value: 'VW' },
      { label: 'Volvo', value: 'Volvo' }
    ];
  }

  ngOnInit(): void {

  }

  calculateClockDifference(clockInValue: any, clockOutValue: any) {
    const diff = this.sharedService.calculateClockDifference(clockInValue, clockOutValue);

    if(diff) {
      this.editVisitForm.controls['ClockDifference'].setValue(diff.toFixed(2));
    }
  }

  onUpdateVisit() {
    this.isFormSubmitted = true;
    if(!this.editVisitForm.valid) {
      return;
    }
    // to be implemented
  }


}
