import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './components/product/product.component';
import { BrandsListingComponent } from './components/brands-listing/brands-listing.component';
import { AddBrandComponent } from './components/Brands/add-brand.component';
import { SuppliersListingComponent } from './components/suppliers-listing/suppliers-listing.component';
import {AddSupplierComponent} from './components/suppliers/add-suppliers.component';
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
import { ProductorderlistbysupplierComponent } from './components/productorderlistbysupplier/productorderlistbysupplier.component';
import { ProductInsightsComponent } from './components/product-insights/product-insights.component';
import { UpdateInventoryComponent } from './components/update-inventory/update-inventory.component';
import { InventoryListingComponent } from './components/inventory-listing/inventory-listing.component';


const routes: Routes = [
        {
          path: 'addproduct',
          component: ProductComponent
        },
        {
          path: 'manage-product',
          component: ManageProductComponent
        },
        {
          path:'add-product',
          component: AddProductComponent
        },
        {
          path:'edit-product/:id',
          component: AddProductComponent
        },
        {
          path:'brands',
          component:BrandsListingComponent
        },
        {
          path:'addbrand',
          component:AddBrandComponent
        },
        {
          path:'suppliers',
          component:SuppliersListingComponent
        },
        {
          path:'addsupplier',
          component:AddSupplierComponent
        },
        {
          path:'importproductviaexcel',
          component:AddProductViaExcelComponent
        },
        {
          path:'categories',
          component:CategoryListingComponent
        },
        {
          path:'categories-listing',
          component:CategorylistingComponent
        },
        {
          path:'subcategories-listing',
          component:SubcategoryListingComponent
        },
        {
          path:'addcategory',
          component:AddCategoryComponent
        },
        {
          path:'addsubcategory',
          component:AddSubcategoryComponent
        },
        {
          path:'importcategory',
          component:ImportCategoryViaExcelComponent
        },
        {
          path:'view-products/:id',
          component: ViewProductComponent
        },
        {
          path:'productlistbysupplier',
          component: ProductorderlistbysupplierComponent
        },
        // {
        //   path:'supplierproductorderhistory',
        //   component: SupplierpurchaseorderhistoryComponent
        // },
        {
          path:'productinsights',
          component: ProductInsightsComponent
        },
        {
          path:'update-inventory',
          component: UpdateInventoryComponent
        },
         
        {
    path:'inventory-listing',
    component:InventoryListingComponent

        }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
