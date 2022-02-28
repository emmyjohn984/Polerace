import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { MarketplacesService } from 'src/app/Platform/marketplaces/services/marketplaces.service';

@Component({
  selector: 'app-add-filters-dialog',
  templateUrl: './add-filters-dialog.component.html',
  styleUrls: ['./add-filters-dialog.component.scss']
})

export class AddFiltersDialogComponent implements OnInit {
  addFilterForm: FormGroup;
  filters: Array<any> = [];
  companyID: number;
  filterId: number;
  customFilters: any;

  constructor(public dialogRef: MatDialogRef<AddFiltersDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private marketplacesService: MarketplacesService, private notificationService: NotificationService) {

    this.addFilterForm = this.formBuilder.group({
      filterId: [0],
      filterName: ['', Validators.required],
    });
    this.companyID = this.data.companyID;
    this.filters = this.data.filters;
    this.filterId = this.data.filterId;
  }

  ngOnInit() {
    if (this.filterId) {
      this.getFiltersById();
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  getFiltersById() {
    this.marketplacesService.getFiltersById(this.filterId).subscribe(response => {
      if (response.body.status == 200) {
        this.customFilters = response.body.data;
        this.addFilterForm.patchValue(this.customFilters);
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error(error.message);
    });
  }

  onSubmitClick() {
    if (!this.addFilterForm.invalid) {

      let postData = {
        companyId: this.companyID,
        filterId: this.addFilterForm.value.filterId,
        filterName: this.addFilterForm.value.filterName,
        filterText: JSON.stringify(this.filters)
      }

      this.marketplacesService.addFilters(postData).subscribe(response => {
        if (response.body.status === 200) {
          this.dialogRef.close();
          this.notificationService.Success(response.body.message);
        }else{
          this.notificationService.Error("Something went wrong, please try again later.");
        }
      }, error => {
        this.notificationService.Error("Something went wrong, please try again later.");
      });
    }
  }
}
