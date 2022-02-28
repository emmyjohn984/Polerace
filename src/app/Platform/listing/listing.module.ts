import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {A11yModule} from '@angular/cdk/a11y';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {OverlayModule} from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListingRoutingModule } from './listing-routing.module';
import { EbayManageProductListingComponent } from './components/ebay-manage-product-listing/ebay-manage-product-listing.component';
import { EbayCategorySpecificationsDialogComponent } from './components/ebay-category-specifications-dialog/ebay-category-specifications-dialog.component';
import {EbayListedProductsComponent} from './components/ebay-listed-products/ebay-listed-products.component';
import {EbayPresetsDialogueComponent} from './components/ebay-presets-dialogue/ebay-presets-dialgue.component';
import { AmazonManageProductListingComponent } from './components/amazon-manage-product-listing/amazon-manage-product-listing.component';
import { AmazonCategorySpecificationsDialogComponent } from './components/amazon-category-specifications-dialog/amazon-category-specifications-dialog.component';
import { AmazonOrdersDatePickersDialogComponent } from './components/amazon-orders-date-pickers-dialog/amazon-orders-date-pickers-dialog.component';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from "@mat-datetimepicker/core";
import { WalmartManageProductListingComponent } from './components/walmart-manage-product-listing/walmart-manage-product-listing.component';
import { WalmartCategorySpecificationsDialogComponent } from './components/walmart-category-specifications-dialog/walmart-category-specifications-dialog.component';
import { AddFiltersDialogComponent } from './components/add-filters-dialog/add-filters-dialog.component';
import { AmazonFeedsStatusComponent } from './components/amazon-feeds-status/amazon-feeds-status.component';

@NgModule({
  declarations: [EbayManageProductListingComponent, EbayCategorySpecificationsDialogComponent,EbayListedProductsComponent,EbayPresetsDialogueComponent, AmazonManageProductListingComponent, AmazonCategorySpecificationsDialogComponent, AmazonOrdersDatePickersDialogComponent, WalmartManageProductListingComponent
    , WalmartCategorySpecificationsDialogComponent, AddFiltersDialogComponent, AmazonFeedsStatusComponent],
  imports: [
    CommonModule,
    ListingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    MatNativeDatetimeModule,
    MatDatetimepickerModule
  ]
})
export class ListingModule { }
