import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryRoutingModule } from './inventory-routing.module';
import { ProductComponent } from './components/product/product.component';
import {BrandsListingComponent} from './components/brands-listing/brands-listing.component';
import {AddBrandComponent} from './components/Brands/add-brand.component';
import {SuppliersListingComponent} from './components/suppliers-listing/suppliers-listing.component';
import {AddSupplierComponent} from './components/suppliers/add-suppliers.component';
import { CustomAttributeComponent } from './components/custom-attribute/custom-attribute.component';
import { AddProductViaExcelComponent } from './components/add-product-via-excel/add-product-via-excel.component';
import { CategoryListingComponent } from './components/category-listing/category-listing.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { ImportCategoryViaExcelComponent } from './components/import-category-via-excel/import-category-via-excel.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ManageProductComponent } from './components/manage-product/manage-product.component';
import { CategorylistingComponent } from './components/categorylisting/categorylisting.component';
import { ViewProductComponent } from './components/view-product/view-product.component';
import { AddSubcategoryComponent } from './components/add-subcategory/add-subcategory.component';
import { SubcategoryListingComponent } from './components/subcategory-listing/subcategory-listing.component';
import { OrderByPipe } from 'src/app/shared/sort.pipe';
import { ProductorderlistbysupplierComponent } from './components/productorderlistbysupplier/productorderlistbysupplier.component';
import { SupplierpurchaseorderhistoryComponent } from './components/supplierpurchaseorderhistory/supplierpurchaseorderhistory.component';
import { ProductInsightsComponent } from './components/product-insights/product-insights.component';
import { UpdateInventoryComponent } from './components/update-inventory/update-inventory.component';
import { InventoryListingComponent } from './components/inventory-listing/inventory-listing.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [ProductComponent,BrandsListingComponent,AddBrandComponent,SuppliersListingComponent,AddSupplierComponent,ProductInsightsComponent,ViewProductComponent, OrderByPipe,CustomAttributeComponent, AddProductViaExcelComponent, CategoryListingComponent, AddCategoryComponent, ImportCategoryViaExcelComponent, AddProductComponent, ManageProductComponent, CategorylistingComponent, AddSubcategoryComponent, SubcategoryListingComponent, ProductorderlistbysupplierComponent, SupplierpurchaseorderhistoryComponent, UpdateInventoryComponent, InventoryListingComponent],

  imports: [
    CommonModule,
    InventoryRoutingModule,
    CommonModule,
    SharedModule
    ]
})
export class InventoryModule { }
