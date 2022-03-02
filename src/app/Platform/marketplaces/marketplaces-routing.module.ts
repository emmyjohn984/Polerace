import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from 'src/app/shared/layout/main/main.component';
import { AuthGuard } from 'src/app/auth/auth-gaurd';
import { ChannelConfigurationsComponent } from './components/channel-configurations/channel-configurations.component';
import { ManageSalesChannelsComponent } from './components/manage-sales-channels/manage-sales-channels.component';
import { MarketplacesFieldsMappingComponent } from './components/marketplaces-fields-mapping/marketplaces-fields-mapping.component';
import { AddMarketplacesComponent } from './components/add-marketplaces/add-marketplaces.component';
import { MarketplaceListingComponent } from './components/marketplace-listing/marketplace-listing.component';
import { AmazonConfigurationDialogComponent } from './components/amazon-configuration-dialog/amazon-configuration-dialog.component';
import { OrdersFromDiffMarketplacesComponent } from './components/orders-from-diff-marketplaces/orders-from-diff-marketplaces.component';
import { ViewOrderdetailsFromDiffChannelsComponent } from './components/view-orderdetails-from-diff-channels/view-orderdetails-from-diff-channels.component';


const routes: Routes =
  [
    // {
    //   path: '',
    //   component: MainComponent,
    //   canActivate: [AuthGuard],
    //   children:
    //     [
          {
            path: 'managesaleschannels', component: ManageSalesChannelsComponent,canActivate:[AuthGuard]
          },
          {
            path: 'channelconfigurations', component: ChannelConfigurationsComponent,canActivate:[AuthGuard]
          },
          {
            path: 'managefieldsmapping', component: MarketplacesFieldsMappingComponent,canActivate:[AuthGuard]
          },
          {
            path: 'add-marketplace',component: AddMarketplacesComponent,canActivate: [AuthGuard]
          },
          {
            path: 'marketplace-listing',component:MarketplaceListingComponent,canActivate: [AuthGuard]
          },
          {
            path: 'manageordersfromglobalmarketplaces',component:OrdersFromDiffMarketplacesComponent,canActivate: [AuthGuard]
          },
          {
            path: 'viewchannelorder', component:ViewOrderdetailsFromDiffChannelsComponent,canActivate:[AuthGuard]
          }
    //     ]
    // }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketplacesRoutingModule { }
