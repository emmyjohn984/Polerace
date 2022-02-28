import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from 'src/app/shared/layout/main/main.component';
import { AuthGuard } from 'src/app/auth/auth-gaurd';
import { EbayManageProductListingComponent } from './components/ebay-manage-product-listing/ebay-manage-product-listing.component';
import { EbayListedProductsComponent } from './components/ebay-listed-products/ebay-listed-products.component';
import { EbayPresetsDialogueComponent } from './components/ebay-presets-dialogue/ebay-presets-dialgue.component';
import { AmazonManageProductListingComponent } from './components/amazon-manage-product-listing/amazon-manage-product-listing.component';
import { WalmartManageProductListingComponent } from './components/walmart-manage-product-listing/walmart-manage-product-listing.component';
import { AmazonFeedsStatusComponent } from './components/amazon-feeds-status/amazon-feeds-status.component';

const routes: Routes =
  [
    {
      path: '',
      component: MainComponent,
      canActivate: [AuthGuard],
      children:
        [
          {
            path: 'ebayproductlisting', component: EbayManageProductListingComponent, canActivate: [AuthGuard]
          }
        ]
    },
    {
      path: '',
      component: MainComponent,
      canActivate: [AuthGuard],
      children:
        [
          {
            path: 'ebaylistedProducts', component: EbayListedProductsComponent, canActivate: [AuthGuard]
          }
        ]
    },
    {
      path: '',
      component: MainComponent,
      canActivate: [AuthGuard],
      children:
        [
          {
            path: 'ebayPresets', component: EbayPresetsDialogueComponent, canActivate: [AuthGuard]
          }
        ]
    },
    {
      path: '',
      component: MainComponent,
      canActivate: [AuthGuard],
      children:
        [
          {
            path: 'amazonproductlisting', component: AmazonManageProductListingComponent, canActivate: [AuthGuard]
          }
        ]
    },
    {
      path: '',
      component: MainComponent,
      canActivate: [AuthGuard],
      children:
        [
          {
            path: 'walmartproductlisting', component: WalmartManageProductListingComponent, canActivate: [AuthGuard]
          }
        ]
    }
    ,
    {
      path: '',
      component: MainComponent,
      canActivate: [AuthGuard],
      children:
        [
          {
            path: 'amazonfeedsstatus', component: AmazonFeedsStatusComponent, canActivate: [AuthGuard]
          }
        ]
    }
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListingRoutingModule { }
