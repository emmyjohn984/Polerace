import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InventoryService } from '../../services/inventory.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';

@Component({
  selector: 'app-custom-attribute',
  templateUrl: './custom-attribute.component.html',
  styleUrls: ['./custom-attribute.component.scss']
})
export class CustomAttributeComponent implements OnInit {
  public breakpoint: number; // Breakpoint observer code
  public addCusForm: FormGroup;
  wasFormChanged = false;
  userData: any = {};
  attributeTypes: Array<any> = [];
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private inventoryService: InventoryService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CustomAttributeComponent>
  ) { }

  public ngOnInit(): void {
    this.addCusForm = this.fb.group({
      customAttributeName: ['', Validators.required],
      customAttributeValue: ['', Validators.required],
      customAttributeTypeId: ['', Validators.required]
    });
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code
    this.userData = JSON.parse(localStorage.getItem('currentUser')?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser'));
    this.getCustomAttributeTypes();
  }

  public onAddCustomAttribute(): void {
    this.markAsDirty(this.addCusForm);
    if (this.addCusForm.invalid) {
      return;
    }
    this.submitted = true;
    let postData = this.addCusForm.value;
    postData.companyId = this.userData.companyId;
    this.inventoryService.createUpdateCustomAttributes(postData).subscribe(response => {
      if (response != null && response.body.status === 200) {
        this.notificationService.Success(response.body.message);
        this.dialogRef.close({event:'Add', data:response.body.data});
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error("Something went wrong. Please try again later");
    });
  }


  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }

  private markAsDirty(group: FormGroup): void {
    group.markAsDirty();

    for (const i in group.controls) {
      group.controls[i].markAsDirty();
    }
  }

  formChanged() {
    this.wasFormChanged = true;
  }

  cancelClick(): void {
    this.dialog.closeAll();
  }

  //To get attribute types
  getCustomAttributeTypes() {
    this.inventoryService.getCustomAttributeTypes().subscribe(response => {
      if (response !== null && response.body.data !== null) {
        this.attributeTypes = response.body.data;
      }
      else {
        console.log("this.message", response.body.message);
      }
    }, error => {
      console.log('this.error', error);
    });
  }

}
