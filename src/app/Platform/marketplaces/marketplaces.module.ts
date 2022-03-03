import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketplacesRoutingModule } from './marketplaces-routing.module';
import { ManageSalesChannelsComponent } from './components/manage-sales-channels/manage-sales-channels.component';
import { EBayConfigurationDialogComponent } from './components/e-bay-configuration-dialog/e-bay-configuration-dialog.component';
import { WalmartConfigurationDialogComponent } from './components/walmart-configuration-dialog/walmart-configuration-dialog.component';
import { AmazonConfigurationDialogComponent } from './components/amazon-configuration-dialog/amazon-configuration-dialog.component';
import { ChannelConfigurationsComponent } from './components/channel-configurations/channel-configurations.component';
import { AddSalesTaxesDialogComponent } from './components/add-sales-taxes-dialog/add-sales-taxes-dialog.component';
import { MarketplacesFieldsMappingComponent } from './components/marketplaces-fields-mapping/marketplaces-fields-mapping.component';
import { ProgressSpinnerModule } from 'src/app/shared/progress-spinner/progress-spinner/progress-spinner.module';
import { AddMarketplacesComponent } from './components/add-marketplaces/add-marketplaces.component';
import { MarketplaceListingComponent } from './components/marketplace-listing/marketplace-listing.component';
import { OrdersFromDiffMarketplacesComponent } from './components/orders-from-diff-marketplaces/orders-from-diff-marketplaces.component';
import { ViewOrderdetailsFromDiffChannelsComponent } from './components/view-orderdetails-from-diff-channels/view-orderdetails-from-diff-channels.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ManageSalesChannelsComponent, ChannelConfigurationsComponent,EBayConfigurationDialogComponent, WalmartConfigurationDialogComponent, AmazonConfigurationDialogComponent, AddSalesTaxesDialogComponent, MarketplacesFieldsMappingComponent, AddMarketplacesComponent, MarketplaceListingComponent, OrdersFromDiffMarketplacesComponent, ViewOrderdetailsFromDiffChannelsComponent],
  imports: [
    MarketplacesRoutingModule,
    CommonModule,
    SharedModule,
    ProgressSpinnerModule,
  ]
})
export class MarketplacesModule { }
