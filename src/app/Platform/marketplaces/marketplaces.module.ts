import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketplacesRoutingModule } from './marketplaces-routing.module';
import { ManageSalesChannelsComponent } from './components/manage-sales-channels/manage-sales-channels.component';
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
import { EBayConfigurationDialogComponent } from './components/e-bay-configuration-dialog/e-bay-configuration-dialog.component';
import { WalmartConfigurationDialogComponent } from './components/walmart-configuration-dialog/walmart-configuration-dialog.component';
import { AmazonConfigurationDialogComponent } from './components/amazon-configuration-dialog/amazon-configuration-dialog.component';
import { ChannelConfigurationsComponent } from './components/channel-configurations/channel-configurations.component';
import { AddSalesTaxesDialogComponent } from './components/add-sales-taxes-dialog/add-sales-taxes-dialog.component';
import { MarketplacesFieldsMappingComponent } from './components/marketplaces-fields-mapping/marketplaces-fields-mapping.component';
import { ProgressSpinnerModule } from 'src/app/shared/progress-spinner/progress-spinner/progress-spinner.module';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { AddMarketplacesComponent } from './components/add-marketplaces/add-marketplaces.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MarketplaceListingComponent } from './components/marketplace-listing/marketplace-listing.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { OrderByPipe } from 'src/app/shared/sort.pipe';
import { OrdersFromDiffMarketplacesComponent } from './components/orders-from-diff-marketplaces/orders-from-diff-marketplaces.component';
import {DropdownModule} from 'primeng/dropdown';
import { ViewOrderdetailsFromDiffChannelsComponent } from './components/view-orderdetails-from-diff-channels/view-orderdetails-from-diff-channels.component';
import {MultiSelectModule} from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  declarations: [ManageSalesChannelsComponent, ChannelConfigurationsComponent,EBayConfigurationDialogComponent, WalmartConfigurationDialogComponent, AmazonConfigurationDialogComponent, AddSalesTaxesDialogComponent, MarketplacesFieldsMappingComponent, AddMarketplacesComponent, MarketplaceListingComponent, OrdersFromDiffMarketplacesComponent, ViewOrderdetailsFromDiffChannelsComponent],
  imports: [
    DropdownModule,
    CommonModule,
    ButtonModule,
    MarketplacesRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    TableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    InputSwitchModule,
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
    ProgressSpinnerModule,
    AutocompleteLibModule,
    MultiSelectModule,
    TooltipModule,
    FileUploadModule
  ]
})
export class MarketplacesModule { }
