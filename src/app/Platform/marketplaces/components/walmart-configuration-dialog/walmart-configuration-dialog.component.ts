import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { ActivatedRoute } from '@angular/router';
import { MarketplacesService } from '../../services/marketplaces.service';
import { Channels } from 'src/app/shared/enums/channels';
import { Router } from '@angular/router';

@Component({
  selector: 'app-walmart-configuration-dialog',
  templateUrl: './walmart-configuration-dialog.component.html',
  styleUrls: ['./walmart-configuration-dialog.component.scss']
})
export class WalmartConfigurationDialogComponent implements OnInit {
  IsConnectClicked:boolean = false;
  walmartFormGroup: FormGroup;
    userData: any={};
    marketplaceSiteIDs: Array<any> = [];
  marketplaceSites: Array<any> = [];
  selectedMarketplaceRegion:any;
  regions:any;
  globalMarketplaceSites:Array<any>;

  constructor(public dialogRef: MatDialogRef<WalmartConfigurationDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
  private marketplaceService: MarketplacesService, private notificationService: NotificationService, private router: Router,private route: ActivatedRoute) {
    this.getMarketplaceSites();
  }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('currentUser')?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser'));
    this.walmartFormGroup = this.formBuilder.group({
      clientId: ['', Validators.required],
      clientSecret: ['', Validators.required],
      globalMarketplaceSiteID:['',Validators.required]
    });

  }
  //Get from controls
  get formControls() {
    return this.walmartFormGroup.controls;
  }

 globalMarketplaceSiteChange(event) {
    this.regions = '';
    this.selectedMarketplaceRegion = this.globalMarketplaceSites.find(c => c.globalMarketplaceSiteId == event.value);
    // this.marketplaceSites = this.selectedMarketplaceRegion.globalMarketplaceSiteName;
    // this.marketplaceSites.forEach(element => {
    //   this.regions += element.globalMarketplaceSiteName + ',';
    // })
    // let strCount = this.regions.length;
    // this.regions = this.regions.substring(0, strCount - 1)
  }

  getMarketplaceSites() {
    this.marketplaceService.getGlobalMarketplaceLocaleByChannelID(Channels.Walmart).subscribe(response => {
      if (response !== null && response.body.status == 200) {
        this.globalMarketplaceSites = response.body.data;
      }
      else {
        console.log("this.message", response.body.message);
      }
    }, error => {
      console.log("this.error", error.message);
    });
  }

  onSubmit(){
    if(!this.walmartFormGroup.invalid){
      let postData = this.walmartFormGroup.value;

      let marketplaceSiteList = [];
      let marketplaceSite = {
        globalMarketplaceSiteId: this.selectedMarketplaceRegion.globalMarketplaceSiteId,
        regionCode: this.selectedMarketplaceRegion.globalMarketplaceSiteName
      };
      marketplaceSiteList.push(marketplaceSite);
        postData.companyId= this.userData.companyId,
        postData.globalMarketplaceId = Channels.Walmart,
        postData.userMarketplaceSiteMapList = marketplaceSiteList,
        postData.userMarketPlaceName ="walmart-"+ this.selectedMarketplaceRegion.globalMarketplaceSiteName;

      this.marketplaceService.addWalmartDetails(postData).subscribe(response=>{
        if(response.status==200){
          if(response.body.data!=null){
          this.notificationService.Success(response.body.message);
          this.onNoClick();
          this.router.navigate(['/marketplaces/managesaleschannels']);
          }
          else
          this.notificationService.Error(response.body.message);

        }
      });

    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onConnectBtnClick(){
    this.IsConnectClicked = true;
  }
  onCancelBtnClick(){
    this.IsConnectClicked = false;
  }
}
