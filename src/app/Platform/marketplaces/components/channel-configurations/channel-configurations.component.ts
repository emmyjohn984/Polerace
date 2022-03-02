import { Component, OnInit } from '@angular/core';
import { MarketplacesService } from '../../services/marketplaces.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { WalmartConfigurationDialogComponent } from '../walmart-configuration-dialog/walmart-configuration-dialog.component';
import { AmazonConfigurationDialogComponent } from '../amazon-configuration-dialog/amazon-configuration-dialog.component';
import { EBayConfigurationDialogComponent } from '../e-bay-configuration-dialog/e-bay-configuration-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Channels } from 'src/app/shared/enums/channels';

@Component({
  selector: 'app-channel-configurations',
  templateUrl: './channel-configurations.component.html',
  styleUrls: ['./channel-configurations.component.scss']
})
export class ChannelConfigurationsComponent implements OnInit {
  authCode: string = '';
  expires_in: string = '';
  iseBay: boolean = false;
  iseBayTokenFetched: boolean;
  eBayToken: any={};
  userData: any={};
  marketplaceSites: Array<any>=[];

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private marketplacesService: MarketplacesService, private notificationService: NotificationService, private router: Router) {
    this.readQueryStringValues();
  }
  private readQueryStringValues() {
    this.route.queryParams.subscribe(params => {
      this.authCode = params['code'];
      this.expires_in = params['expires_in'];
      this.iseBay = params['iseBay'];
    });

  }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('currentUser')?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser'));
    if (this.iseBay && this.authCode) {
      this.geteBayOAuthAccessToken();
    }
  }

  //To get eBay OAuth access token
  geteBayOAuthAccessToken() {
    let postData = {
      authCode: this.authCode
    }
    this.marketplacesService.geteBayOAuthAccessToken(postData).subscribe(response => {
      if (response != null) {
        this.iseBayTokenFetched = true;
        this.eBayToken = response.body.data;
        this.notificationService.Success(response.body.message);
        this.createeBayMarketplace();
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      console.log('this.error', error);
    });
  }

  //To save eBay marketplace
  createeBayMarketplace() {
    let setupeBayData = JSON.parse(sessionStorage.setupeBayData);
    setupeBayData.globalMarketplaceSiteIDs.forEach(item => {
      let marketplaceSite = {
        globalMarketplaceSiteId: item
      }
      this.marketplaceSites.push(marketplaceSite);
    });
    let postData = {
      companyId: this.userData.companyId,
      globalMarketplaceId:Channels.eBay,
       userMarketplaceName: setupeBayData.accountName,
      UserAccessToken: this.eBayToken.access_token,
      refreshToken: this.eBayToken.refresh_token,
      tokenExpirySeconds: parseFloat(this.eBayToken.expires_in),
      refreshTokenExpirySeconds: parseFloat(this.eBayToken.refresh_token_expires_in),
      userMarketplaceSiteMapList: this.marketplaceSites,
      clientId:null,
      clientSecret:null,
      iseBay: true,
      isOauth:true
    }

    this.marketplacesService.createUpdateMarketplace(postData).subscribe(response => {
      if (response != null) {
        sessionStorage.removeItem("setupeBayData");
        this.notificationService.Success(response.body.message);
        this.router.navigate(['/marketplaces/managesaleschannels']);
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error(error.message);
    });
  }

  openeBayConfigurationDialog(): void {
    const dialogRef = this.dialog.open(EBayConfigurationDialogComponent, {
      width:'800px',
       data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openAmazonConfigurationDialog(): void {
    const dialogRef = this.dialog.open(AmazonConfigurationDialogComponent, {
      width:'800px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openWalmartConfigurationDialog(): void {
    const dialogRef = this.dialog.open(WalmartConfigurationDialogComponent, {
      width:'800px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUser');
    window.location.reload();//workaround- need correction
    // this.router.navigate(['./auth/login']);
  }



}
