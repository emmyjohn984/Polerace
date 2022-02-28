import Inputmask from "inputmask";
import { Component, OnInit, Input, Output, EventEmitter, forwardRef, Self, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, NgControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'dnd-evv-masked-datetime-input',
  templateUrl: './masked-datetime-input.component.html',
  styleUrls: ['./masked-datetime-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaskedDatetimeInputComponent),
      multi: true,
    }
  ]
})
export class MaskedDatetimeInputComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @Input() placeHolder: string;
  @Input() validation = false;
  @Input() disabled = false;
  public _value: number;
  public isDisabled: boolean;
  private onChange;
  private onTouch;
  dropControl = new FormControl('');
  @ViewChild('dateInput', {static: true, read: ElementRef}) dateInput: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
     Inputmask({'alias': 'datetime','inputFormat': 'yyyy/mm/dd hh:MM tt'}).mask(this.dateInput.nativeElement);
  }

  onChanged: any = () => {}
  onTouched: any = () => {}

  writeValue(val) {
    this._value = val;
  }

  registerOnChange(fn: any){
    this.onChanged = fn
  }
  registerOnTouched(fn: any){
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  setValue(value: any) {
    if(!this.disabled && value) {
      this._value = value;
      this.onChanged(value);
      this.onTouched();
    }
  }

}
