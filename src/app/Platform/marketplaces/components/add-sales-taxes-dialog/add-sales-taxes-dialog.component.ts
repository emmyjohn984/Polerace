import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { ActivatedRoute } from '@angular/router';
import { MarketplacesService } from '../../services/marketplaces.service';

@Component({
  selector: 'app-add-sales-taxes-dialog',
  templateUrl: './add-sales-taxes-dialog.component.html',
  styleUrls: ['./add-sales-taxes-dialog.component.scss']
})
export class AddSalesTaxesDialogComponent implements OnInit {
  addTaxFormGroup: FormGroup;
  submitted: boolean = false;
  companyId: number;
  constructor(public dialogRef: MatDialogRef<AddSalesTaxesDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private marketplaceService: MarketplacesService, private notificationService: NotificationService, private route: ActivatedRoute) {
    this.companyId = this.data.companyId;
  }

  ngOnInit(): void {
    this.addTaxFormGroup = this.formBuilder.group({
      salesTaxId: [0],
      salesTaxName: ['', Validators.required],
      salesTaxRate: [0, Validators.required],

    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  //Get from controls
  get formControls() {
    return this.addTaxFormGroup.controls;
  }

  //To save tax
  onSubmit() {
    if (this.addTaxFormGroup.invalid) {
      return;
    }
    else {
      this.submitted = true;
      let postData = this.addTaxFormGroup.value;
      postData.companyId = this.companyId;
      this.marketplaceService.addUpdateSalesTax(postData).subscribe(response => {
        if (response != null && response.body.data != null && response.body.status == 200) {
          this.submitted = false;
          this.notificationService.Success(response.body.message)
          this.dialogRef.close({event:'Add', data:response.body.data});
        }
        else {
          this.notificationService.Error(response.body.message)
        }
      },
        error => {
          this.notificationService.Error(error.message)
        }
      )
    }
  }


}

