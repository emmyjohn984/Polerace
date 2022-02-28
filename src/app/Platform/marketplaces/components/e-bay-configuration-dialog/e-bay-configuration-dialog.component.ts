import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MarketplacesService } from '../../services/marketplaces.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { Channels } from 'src/app/shared/enums/channels';
import { ActivatedRoute } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-e-bay-configuration-dialog',
  templateUrl: './e-bay-configuration-dialog.component.html',
  styleUrls: ['./e-bay-configuration-dialog.component.scss']
})
export class EBayConfigurationDialogComponent implements OnInit {
  setupeBayFormGroup: FormGroup;
  isEditable = false;
  isConnecteBay = false;
  eBayMarketplaceSites: Array<any> = [];
  authCode: string = '';
  expires_in: string = '';
  iseBayTokenFetched: boolean = false;

  constructor(public dialogRef: MatDialogRef<EBayConfigurationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private marketplacesService: MarketplacesService, private notificationService: NotificationService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.setupeBayFormGroup = this.formBuilder.group({
      accountName: ['', Validators.required],
      globalMarketplaceSiteIDs: ['', Validators.required]
    });

  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  goForward(stepper: MatStepper) {
    sessionStorage.setItem('setupeBayData', JSON.stringify(this.setupeBayFormGroup.value));
    stepper.next();
  }

 //Get from controls
 get formControls() {
  return this.setupeBayFormGroup.controls;
}
  backToOverview() {
    this.isConnecteBay = false;
    this.setupeBayFormGroup.markAsPristine();
    this.setupeBayFormGroup.markAsUntouched();
  }

  connecteBayPopupStep(index) {
    this.isConnecteBay = true;
    this.isEditable = true;
    this.geteBayMarketplaceSites();

  }

  geteBayMarketplaceSites() {
    this.marketplacesService.getGlobalMarketplaceLocaleByChannelID(Channels.eBay).subscribe(response => {
      if (response !== null && response.body.status == 200) {
        this.eBayMarketplaceSites = response.body.data;
      }
      else {
        console.log("this.message", response.body.message);
      }
    }, error => {
      console.log("this.error", error.message);
    });
  }

  eBayForAuthorizationClick() {
    this.marketplacesService.connecteBayForAuthorization().subscribe(response => {
      if (response !== null && response.body.status == 200) {debugger
        sessionStorage.setItem('response.body.data', response.body.data);
        window.location.href = response.body.data.eBayUrl;
        // window.location.href='https://www.ebay.com/signin/';
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error(error.message);
    });
  }

}
