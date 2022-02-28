import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { AmazonListingService } from '../../services/amazon-listing.service';
import * as moment from 'moment';
import { WalmartListingService } from '../../services/walmart-listing.service';

@Component({
  selector: 'app-amazon-orders-date-pickers-dialog',
  templateUrl: './amazon-orders-date-pickers-dialog.component.html',
  styleUrls: ['./amazon-orders-date-pickers-dialog.component.scss'],
})

export class AmazonOrdersDatePickersDialogComponent implements OnInit {
  form: FormGroup;
  channel: string = '';

  constructor(public dialogRef: MatDialogRef<AmazonOrdersDatePickersDialogComponent>, private formBuilder: FormBuilder, private walmartListingService: WalmartListingService
    , private amazonListingService: AmazonListingService, private notificationService: NotificationService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.channel = data.channel;
    this.form = this.formBuilder.group({
      startDate: [{ value: '', disabled: true }, Validators.required],
      endDate: [{ value: '', disabled: true }, Validators.required]
    });
  }

  ngOnInit() {
    this.form.get('startDate').setValue(new Date()),
      this.form.get('endDate').setValue(new Date()),
      this.form.get('startDate').enable();
    this.form.get('endDate').enable();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmitClick() {
    if (!this.form.invalid) {
      if (this.channel == 'Walmart') {
        let payload = {
          startDate: moment(this.form.value.startDate).format('YYYY-MM-DDTHH:mm:ss'),
          endDate: moment(this.form.value.endDate).format('YYYY-MM-DDTHH:mm:ss')
        }
        this.walmartListingService.syncWalmartOrders(payload).subscribe(response => {
          if (response != null && response.body.status === 200) {
            this.dialogRef.close({ event: 'Walmart' });
            this.notificationService.Success(response.body.message);
          }
        }, error => {
          this.notificationService.Error(error.message);
        });
      }
      else if (this.channel == 'Amazon') {
        this.amazonListingService.getAmazonOrders(moment(this.form.value.startDate).format('YYYY-MM-DDTHH:mm:ss'), moment(this.form.value.endDate).format('YYYY-MM-DDTHH:mm:ss')).subscribe(response => {
          if (response != null && response.body.status === 200) {
            this.dialogRef.close({ event: 'Amazon' });
            this.notificationService.Success(response.body.message);
          }
        }, error => {
          this.notificationService.Error(error.message);
        });
      }
    }
  }
}

