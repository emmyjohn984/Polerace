import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventoryRoutingModule } from './inventory-routing.module';
import { ProductComponent } from './components/product/product.component';
import { ProductListingComponent } from './components/product-listing/product-listing.component';
import {BrandsListingComponent} from './components/brands-listing/brands-listing.component';
import {AddBrandComponent} from './components/Brands/add-brand.component';
import {SuppliersListingComponent} from './components/suppliers-listing/suppliers-listing.component';
import {AddSupplierComponent} from './components/suppliers/add-suppliers.component';
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
import { AngularEditorModule } from '@kolkov/angular-editor';
import { InputMaskModule } from 'primeng/inputmask';
import { CustomAttributeComponent } from './components/custom-attribute/custom-attribute.component';
import { AddProductViaExcelComponent } from './components/add-product-via-excel/add-product-via-excel.component';
import { CategoryListingComponent } from './components/category-listing/category-listing.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { ImportCategoryViaExcelComponent } from './components/import-category-via-excel/import-category-via-excel.component';
import { ProgressSpinnerModule } from 'src/app/shared/progress-spinner/progress-spinner/progress-spinner.module';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ManageProductComponent } from './components/manage-product/manage-product.component';
import { CategorylistingComponent } from './components/categorylisting/categorylisting.component';
import { ViewProductComponent } from './components/view-product/view-product.component';
import { TableModule } from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import {DropdownModule} from 'primeng/dropdown';
import { AddSubcategoryComponent } from './components/add-subcategory/add-subcategory.component';
import { SubcategoryListingComponent } from './components/subcategory-listing/subcategory-listing.component';
import { InputTextModule } from 'primeng/inputtext';
import { OrderByPipe } from 'src/app/shared/sort.pipe';
import { ButtonModule } from "primeng/button";
import { TooltipModule } from 'primeng/tooltip';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { ProductorderlistbysupplierComponent } from './components/productorderlistbysupplier/productorderlistbysupplier.component';
import { SupplierpurchaseorderhistoryComponent } from './components/supplierpurchaseorderhistory/supplierpurchaseorderhistory.component';
import { FieldsetModule } from 'primeng/fieldset';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { ChartsModule } from 'angular-bootstrap-md';
import { ProductInsightsComponent } from './components/product-insights/product-insights.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { GalleriaModule } from 'primeng';
import { UpdateInventoryComponent } from './components/update-inventory/update-inventory.component';
import { ChartsModule } from 'ng2-charts';
import { InventoryListingComponent } from './components/inventory-listing/inventory-listing.component';
@NgModule({
  declarations: [ProductComponent, ProductListingComponent,BrandsListingComponent,AddBrandComponent,SuppliersListingComponent,AddSupplierComponent,ProductInsightsComponent,ViewProductComponent, OrderByPipe,CustomAttributeComponent, AddProductViaExcelComponent, CategoryListingComponent, AddCategoryComponent, ImportCategoryViaExcelComponent, AddProductComponent, ManageProductComponent, CategorylistingComponent, AddSubcategoryComponent, SubcategoryListingComponent, ProductorderlistbysupplierComponent, SupplierpurchaseorderhistoryComponent, UpdateInventoryComponent, InventoryListingComponent],

  imports: [
    CommonModule,
    InventoryRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    NgxCsvParserModule,
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
    InputSwitchModule,
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
    InputTextModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    DropdownModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    AngularEditorModule,
    ProgressSpinnerModule,
    TableModule,
    DialogModule,
    ButtonModule,
    TooltipModule,
    FieldsetModule,
    NgbModule,
    // ChartsModule,
    MatFormFieldModule,
    GalleriaModule,
    ChartsModule
  ]
})
export class InventoryModule { }
