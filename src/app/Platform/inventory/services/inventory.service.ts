import { Injectable } from '@angular/core';
import { ApiService } from 'libs/core-services/src';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class InventoryService {

  private getProductListUrl = "Inventory/GetProductList/"
  private getBrandsUrl = "Inventory/GetBrands/"
  private getSuppliersUrl = "Inventory/GetSuppliers/"
  private getConditionsUrl = "Inventory/GetConditions"
  private createProductURL = "Inventory/CreateProduct";
  private updateInventoryURL = "Inventory/UpdateInventory";
  private createBrandUrl = "Inventory/CreateUpdateBrand";
  private getBrandByIdURL = "Inventory/GetBrandById/";
  private deleteBrandUrl = "Inventory/deletebrandbyid/"
  private deleteProductUrl = "Inventory/DeleteProductById/"
  private getProductByIdUrl = "Inventory/GetProductById/"
  private updateProductURL = "Inventory/UpdateProduct";
  private getSupplierByIdUrl = "Inventory/GetSupplierById/"
  private createUpdateSupplierURL = "Inventory/CreateUpdateSupplier";
  private deletesupplierUrl = "Inventory/deletesupplier/";
  private deleteProductImagesURL = "Inventory/DeleteProductImages";
  private uploadProductImagesURL = "Inventory/UploadProductImages";
  private getCustomAttributeTypesURL = "Inventory/GetCustomAttributeTypes";
  private getCustomAttributesURL = "Inventory/GetCustomAttributes/";
  private createUpdateCustomAttributesURL = "Inventory/CreateUpdateCustomAttributes";
  private deleteCustomAttributeURL = "Inventory/DeleteCustomAttribute/";
  private deleteInventoryCustomAttributeURL = "Inventory/DeleteInventoryCustomAttribute/";
  private checkProductSKUExistURL = "Inventory/CheckProductSKUExist/";
  private importProductViaExcelURL = "Inventory/ImportProductViaExcel";
  private getFiltersUrl = "Marketplaces/GetFilters/";
  private getCategoriesURL = "Inventory/GetCategories/";
  private getCategoryByIdURL = "Inventory/GetCategoryById/";
  private createUpdateCategoryURL = "Inventory/CreateUpdateCategory";
  private deleteCategoryURL = "Inventory/DeleteCategory/";
  private addProductImageAsPrimaryURL = "Inventory/AddProductImageAsPrimary";
  private importCategoryViaExcelURL = "Inventory/ImportCategoriesViaExcel";
  private getProductListBySupplier = "Inventory/GetProductListBySupplierAndCompany/";
  private getSupplierPurchasetOrderHistory = "Inventory/GetPurchaseOrderListHistory/";
  private getSubCategoriesByyId = "Inventory/GetSubCategories/"
  private getSubCategoriesByCompanyId = "Inventory/GetSubCategoriesList/"
  private graphDataURL = "Marketplaces/GetProductInsightsGraphicalOrder/";
  private channelDataURL = "Marketplaces/GetProductSellInDifferentChannelDataFilter/";
  private GetGlobalMarketplaceDataURL = "Marketplaces/GetGlobalMarketplaceData";
  private getPurchaseOrderListHistoryByCompanyId = "Inventory/GetPurchaseOrderListHistory/";
  private getInventory = "Inventory/GetInventoryList/";
  private getinventoryById = "Inventory/GetInventoryById/";
  private GetShippingPackageList = "ShippingPackage/GetShippingPackageList/";

  private del = "Inventory/DeleteInventoryById/";




  constructor(private coreService: ApiService) {
  }


  deleteinventory(inventoryId) {

    return this.coreService.postData(environment.apiUrl + this.del + inventoryId, null, null);

  }

  getinventoryByIdd(inventoryId) {

    return this.coreService.getData(environment.apiUrl + this.getinventoryById + inventoryId, null);

  }

  getInventoryList(companyID: any) {
    return this.coreService.getData(environment.apiUrl + this.getInventory + companyID, null);
  }
  GetGlobalMarketplaceData() {
    return this.coreService.getData(environment.apiUrl + this.GetGlobalMarketplaceDataURL, null);
  }
  //To get subcategories
  getSubCategoriesById(companyId: number) {
    return this.coreService.getData(environment.apiUrl + this.getSubCategoriesByCompanyId + companyId, null)
  }

  //To get product
  getProductList(companyId: number) {
    return this.coreService.getData(environment.apiUrl + this.getProductListUrl + companyId, null);
  }

  GetSubCategories(companyId: number, categoryId: number) {
    return this.coreService.getData(environment.apiUrl + this.getSubCategoriesByyId + companyId + '/' + categoryId, null);
  }

  //To get product
  getFilterdProducts(inventory) {

    return this.coreService.postData(environment.apiUrl + this.getProductListUrl, inventory, null);
  }

  //To get brands
  getBrands(companyId: number) {
    return this.coreService.getData(environment.apiUrl + this.getBrandsUrl + companyId, null);
  }

  //To delete brand by user id
  deleteBrand(brandId: number) {
    return this.coreService.postData(environment.apiUrl + this.deleteBrandUrl + brandId, null, null);
  }

  createUpdateBrand(postData) {
    return this.coreService.postData(environment.apiUrl + this.createBrandUrl, postData, null);
  }
  //To get brands
  getBrandById(brandId: number) {
    return this.coreService.getData(environment.apiUrl + this.getBrandByIdURL + brandId, null);
  }
  //To get suppliers
  getSuppliers(companyId: number) {
    return this.coreService.getData(environment.apiUrl + this.getSuppliersUrl + companyId, null);
  }

  //To get Conditions
  getConditions() {
    return this.coreService.getData(environment.apiUrl + this.getConditionsUrl, null);
  }
  importCsv(postData) {
    //.return this.coreService.postData(environment.apiUrl +this.importCsvUrl, postData, null);

  }
  getShippingList(param: any) {
    return this.coreService.getData(environment.apiUrl + this.GetShippingPackageList, param);
  }

  //To create product
  createProduct(postData) {
    const params = {
      'CustomProductDetails': postData.customInventoryDetails.customInventoryDetails,
      'Products': postData.inventory,
      'ProductImages': postData.inventoryImages.inventoryImages,
      'inventoryVariationAttributes': postData.inventoryVariationAttributes.inventoryVariationAttributes,
      'ProductVariations': postData.inventoryVariations.inventoryVariations,
      'shippingPackageDetails':postData.shippingPackageDetails
    }
    return this.coreService.postData(environment.apiUrl + this.createProductURL, params, null);
  }

  //To delete product
  deleteProduct(productId: number) {
    return this.coreService.postData(environment.apiUrl + this.deleteProductUrl + productId, null, null);
  }

  //To get product by id
  getProductById(productId: number) {
    return this.coreService.getData(environment.apiUrl + this.getProductByIdUrl + productId, null);
  }

  //To update product
  updateProduct(postData) {
    const params = {
      'customProductDetails': postData.customInventoryDetails.customInventoryDetails,
      'products': postData.inventory,
      'productImages': postData.inventoryImages.inventoryImages,
      //'inventoryVariationAttributes': postData.inventoryVariationAttributes.inventoryVariationAttributes,
      'productVariations': postData.inventoryVariations.inventoryVariations,
      'shippingPackageDetails':postData.shippingPackageDetails
    }
    return this.coreService.postData(environment.apiUrl + this.updateProductURL, params, null);
  }

  // Update Inventory
  updateInventory(postData) {
    const params = {
      'customInventoryDetails': postData.customInventoryDetails.customInventoryDetails,
      'inventory': postData.inventory,
      'inventoryImages': postData.inventoryImages.inventoryImages,
      'inventoryVariationAttributes': postData.inventoryVariationAttributes.inventoryVariationAttributes,
      'inventoryVariations': postData.inventoryVariations.inventoryVariations
    }

    return this.coreService.postData(environment.apiUrl + this.updateInventoryURL, params, null);
  }

  getSupplierById(supplierId: number) {
    return this.coreService.getData(environment.apiUrl + this.getSupplierByIdUrl + supplierId, null);
  }

  //To delete brand by user id
  deleteSupplier(supplierId: number) {
    return this.coreService.postData(environment.apiUrl + this.deletesupplierUrl + supplierId, null, null);
  }

  createUpdateSupplier(postData) {
    return this.coreService.postData(environment.apiUrl + this.createUpdateSupplierURL, postData, null);
  }
  //To delete product
  deleteProductImages(postData) {
    return this.coreService.postData(environment.apiUrl + this.deleteProductImagesURL, postData, null);
  }
  //To upload product images
  uploadProductImages(postData) {
    return this.coreService.postData(environment.apiUrl + this.uploadProductImagesURL, postData, null);
  }

  //To get attribute types
  getCustomAttributeTypes() {
    return this.coreService.getData(environment.apiUrl + this.getCustomAttributeTypesURL, null);
  }

  //To get attributes
  getCustomAttributes(companyId: number) {
    return this.coreService.getData(environment.apiUrl + this.getCustomAttributesURL + companyId, null);
  }

  //To create or update attribute
  createUpdateCustomAttributes(postData) {
    return this.coreService.postData(environment.apiUrl + this.createUpdateCustomAttributesURL, postData, null);
  }

  //To delete attribute
  deleteCustomAttribute(customAttributeId) {
    return this.coreService.postData(environment.apiUrl + this.deleteCustomAttributeURL + customAttributeId, null, null);
  }

  //To delete inventory custom attribute details
  deleteInventoryCustomAttribute(inventoryCustomFieldId) {
    return this.coreService.postData(environment.apiUrl + this.deleteInventoryCustomAttributeURL + inventoryCustomFieldId, null, null);
  }

  //To check SKU exists or not
  checkProductSKUExist(inventoryID, sku, companyID) {
    return this.coreService.postData(environment.apiUrl + this.checkProductSKUExistURL + inventoryID + '/' + sku + '/' + companyID, null, null);
  }

  // get product order history
  getPurchaseOrderHIstory(companyID: number, supplierId: number) {
    return this.coreService.getData(environment.apiUrl + this.getPurchaseOrderListHistoryByCompanyId + companyID + '/' + supplierId, null);
  }

  //To Import Product Via Excel
  importProductViaExcel(postData) {
    const formData: FormData = new FormData();
    formData.append('thumbnail', postData);
    return this.coreService.postExcelData(environment.apiUrl + this.importProductViaExcelURL, formData, null);
  }

  //To get filters
  getFilters(companyId: number) {
    return this.coreService.getData(environment.apiUrl + this.getFiltersUrl + companyId, null);
  }

  //To get categories
  getCategories(companyId: number) {
    return this.coreService.getData(environment.apiUrl + this.getCategoriesURL + companyId, null);
  }

  //To save/update category
  createUpdateCategory(payload) {
    return this.coreService.postData(environment.apiUrl + this.createUpdateCategoryURL, payload, null);
  }

  //To get category by ID
  getCategoryById(categoryID: number) {
    return this.coreService.getData(environment.apiUrl + this.getCategoryByIdURL + categoryID, null);
  }

  //To delete category
  deleteCategory(categoryID: number) {
    return this.coreService.postData(environment.apiUrl + this.deleteCategoryURL + categoryID, null, null);
  }

  // To set product image as Primary
  addProductImageAsPrimary(payload) {
    return this.coreService.postData(environment.apiUrl + this.addProductImageAsPrimaryURL, payload, null);
  }

  // To Import Category Via Excel
  importCategoryViaExcel(postData) {
    return this.coreService.postData(environment.apiUrl + this.importCategoryViaExcelURL, postData, null);
  }

  getProductListBySuplier(companyId: number, supplierId: number) {
    return this.coreService.getData(environment.apiUrl + this.getProductListBySupplier + companyId + "/" + supplierId, null);
  }

  graphData(companyId, globalmarketId) {
    return this.coreService.getData(environment.apiUrl + this.graphDataURL + companyId + '/' + globalmarketId, null);
  }

  channelData(companyId, day, globalmarketId, startDate, endDate) {
    return this.coreService.getData(environment.apiUrl + this.channelDataURL + companyId + "/" + day + "/" + globalmarketId + "/" + startDate + "/" + endDate, null)
  }

  getPurchaseOrderList(CompanyId) {
    return this.coreService.getData(environment.apiUrl + this.getPurchaseOrderListHistoryByCompanyId + CompanyId, null)
  }


}
