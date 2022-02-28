import { Component, OnInit, defineInjectable } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EditVisitsComponent } from '../edit-visits/edit-visits.component';

@Component({
  selector: 'app-search-visits',
  templateUrl: './search-visits.component.html',
  styleUrls: ['./search-visits.component.scss']
})
export class SearchVisitsComponent implements OnInit {
  //mat autocomplte
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  employeeList = [];

  employeeDataSource = []; // table 1 data
  employeeListCols: any[]; //table 1

  employeesVisitsDataSource = [];
  empVisitsCols: any[];

  first = 0;
  rows = 5;

  //prime ng autocomplete multiselct
  officeList = [];
  filteredOfficesList = [];

  searchVisitForm: FormGroup;

  submitted = false;
  showEmployeeList = false;

  selectedCar: any;

  constructor(public dialog: MatDialog, private fb: FormBuilder) {
    this.employeeList = [
      { label: 'Select All', value: null },
      { label: 'Steak', value: 1 },
      { label: 'Pizza', value: 2 },
      { label: 'Tacos', value: 3 }
    ];
    this.searchVisitForm = this.fb.group({
      ViewByEmployee: ['Option 1', []],
      InActiveTimeCard: [null, Validators.required],
      EmployeeName: [null],
      FromDate: [null, Validators.required],
      ToDate: [null, Validators.required],
      Office: [null, Validators.required]
    });
    this.employeeDataSource = [
      {
        code: 'test',
        employee: 'test',
        duration: 'test',
        alarms: 'test'
      },
      {
        code: 'test',
        employee: 'test',
        duration: 'test',
        alarms: 'test'
      },
      {
        code: 'test',
        employee: 'test',
        duration: 'test',
        alarms: 'test'
      },
      {
        code: 'test',
        employee: 'test',
        duration: 'test',
        alarms: 'test'
      },
      {
        code: 'test',
        employee: 'test',
        duration: 'test',
        alarms: 'test'
      },
      {
        code: 'test',
        employee: 'test',
        duration: 'test',
        alarms: 'test'
      }
    ];
    this.employeeListCols = [
      { field: 'code', headerEmpDetail: 'Code' },
      { field: 'employee', headerEmpDetail: 'Employee' },
      { field: 'duration', headerEmpDetail: 'Duration' },
      { field: 'alarms', headerEmpDetail: 'Alarms' }
    ];
    this.empVisitsCols = [
      {
        field: 'edit',
        headerEmpVisitDetail: 'Edit'
      },
      { field: 'date', headerEmpVisitDetail: 'Date' },
      { field: 'jobName', headerEmpVisitDetail: 'JobName' },
      { field: 'in', headerEmpVisitDetail: 'In' },
      { field: 'out', headerEmpVisitDetail: 'Out' },
      { field: 'duration', headerEmpVisitDetail: 'Duration' }
    ];
    this.employeesVisitsDataSource = [
      {
        edit: 'test',
        date: 'test',
        jobName: 'test',
        in: 'test',
        out: 'test',
        duration: 'test'
      },
      {
        edit: 'test',
        date: 'test',
        jobName: 'test',
        in: 'test',
        out: 'test',
        duration: 'test'
      },
      {
        edit: 'test',
        date: 'test',
        jobName: 'test',
        in: 'test',
        out: 'test',
        duration: 'test'
      },
      {
        edit: 'test',
        date: 'test',
        jobName: 'test',
        in: 'test',
        out: 'test',
        duration: 'test'
      },
      {
        edit: 'test',
        date: 'test',
        jobName: 'test',
        in: 'test',
        out: 'test',
        duration: 'test'
      }
    ];
    this.officeList = [
      { label: 'India', value: 1 },
      { label: 'US', value: 2 },
      { label: 'America', value: 3 },
      { label: 'Turkey', value: 3 },
      { label: 'Australia', value: 4 },

    ];
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  //#region "openEditVisitDialog"
  openDialog(): void {
    const dialogRef = this.dialog.open(EditVisitsComponent, {
      width: '900px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
  //#endregion
  //#region  pagination employeelist
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }
  isLastPage(): boolean {
    return this.first === this.employeeDataSource.length - this.rows;
  }

  isFirstPage(): boolean {
    return this.first === 0;
  }
  //#endregion

  //#region "onSelectOffice"
  onSelectOffice(event) {
    this.filteredOfficesList = [];
    for (let i = 0; i < this.officeList.length; i++) {
      let Office = this.officeList[i];
      if (Office.label.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
        this.filteredOfficesList.push(Office);
        this.showEmployeeList = true;
      }
    }
  }

  onOffieSingleSelection(event) {
    this.searchVisitForm.controls['Office'].setValue = event;
  }
  //#endregion

  onSearch() {
    this.submitted = true;
    if (this.searchVisitForm.controls['Office'].valid) {
      this.showEmployeeList = true; //to show tables
    } else {
      return;
    }
  }

  onClear() {
    this.submitted = false;
    this.searchVisitForm.reset();
    this.showEmployeeList = false;
  }

}
interface Employee {
  value: number;
  viewValue: string;
}
