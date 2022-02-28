import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { InventoryService } from '../../services/inventory.service'
import * as FileSaver from 'file-saver';
import { NgxCsvParser } from 'ngx-csv-parser';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {
  @ViewChild('fileImportInput') fileImportInput: any;
  userData: any;
  filtersubc: any;
  loading: boolean = false
  deleteId:number;
  tableData: any = []
  display: boolean = false
  viewProduct: boolean = false
  showModal: boolean = false
  totalRecords: number;
  exportColumns: any;
  suppliers: any;
  companyId: any;
  pageNumber: number = 1;
  pageSize: number = 10;
  isActive = true;
  orderDirection: any = 'ShippingPackageId';
  Direction: any;
  order: any;
  search: any = null;
  cols: any;
  csvRecords: any[] = [];
  header: boolean = false;
  category: any = [];
  categoryName: any = '';
  categories: any = [
    { name: 'amazon', value: 'amazon' },
    { name: 'ebay', value: 'ebay' },
    { name: 'Walmart', value: 'walmart' },
    { name: 'Shopify', value: 'shopify' }
  ]
  keys: any;
  rowdata: any = [];
  selectedColoumns: any[];
  baseColoumns = [
    'title',
    'sku',
    'sellingPrice',
    'quantity',
    'description',
    'categoryName',
    'supplierName',
    'actions'
  ];
  dataSource: any = [];
  constructor(
    public router: Router,
    public inventoryService: InventoryService,
    public toastrService: ToastrService,
    private ngxCsvParser: NgxCsvParser
  ) { }

  ngOnInit(): void {
    this.userData = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    )
    this.cols = [
      { field: 'title', header: 'Product Name' },
      { field: 'sku', header: 'Product Code' },
      { field: 'sellingPrice', header: 'Price' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'description', header: 'Product Description' },
      { field: 'categoryName', header: 'Category name' },
      { field: 'supplierName', header: 'Supplier Name' }
    ]
    this.getProductList();
    this.inventoryService.getCategories(this.userData.companyId).subscribe(res => {
      this.category = res.body.data;
      this.filtersubc = this.category.filter(option => option.parentCategoryId === 0 || option.parentCategoryId === null);
    })
  }

  filterReset() {
    this.categoryName = '';
    this.getProductList();
  }

  addProduct() {
    this.router.navigate(['inventory/add-product'])
  }

  addColoumns(e?) {
    let Array = [];
    this.selectedColoumns.map((res) => {
      Array.push(res);
    });
    let columns = [];
    this.cols.map((res) => {
      columns.push(res.field);
    });

    let compare = Array.filter((val) => !columns.includes(val));
    compare.map(res => { this.baseColoumns.push(res) });

    compare.map((res) => {
      this.cols.push({ field: res, header: _.capitalize(res) });
    });

    let eventArray = [];
    let unSelectValues = [];
    for (let i = 0; i < e.source.options._results.length; i++) {
      eventArray.push(e.source.options._results[i]);
      eventArray.map((res) => {
        if (!res._selected && columns.includes(res.value)) {
          unSelectValues.push(res.value);
        }
      });
    }
    let uniqueValues = [...new Set(unSelectValues)];
    if (uniqueValues.length) {
      uniqueValues.map((res) => {
        let indexOfCols = this.cols.findIndex((x) => x.field === res);
        if (indexOfCols > -1) {
          this.cols.splice(indexOfCols, 1);
        }
      });
    }
  }

  getData(value: any) {
    var formats = [
      moment.ISO_8601,
      "MM/DD/YYYY  :)  HH*mm*ss"
    ];
    let array = [];
    for (let i = 0; i < this.cols.length; i++) {
      if (!moment(value[this.cols[i].field], formats, true).isValid() || typeof value[this.cols[i].field] === 'number') {
        if (this.cols[i].field == 'isActive') {
          if (!!value[this.cols[i].field]) {
            array.push('Active');
          } else {
            array.push('In-Active');
          }
        } else {
          array.push(value[this.cols[i].field]);
        }
      } else {
        array.push(moment(value[this.cols[i].field]).format('MM-DD-YYYY'));
      }
    }
    return array;
  }

  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne.id === objTwo.id;
    }
  }

  edit(id) {
    let inventoryId = id
    this.router.navigate([`inventory/edit-product/${inventoryId}`])
  }

  getProductList() {
    this.inventoryService
      .getProductList(this.userData.companyId)
      .subscribe(res => {
        this.loading = true;
        if (res.body.data) {
          this.tableData = res.body.data;
          this.totalRecords = this.tableData.length;
          this.dataSource = [];
          this.tableData.map(res => {
            this.dataSource.push(res.products);
          });
          this.loading = false;
          if (!this.keys) {
            this.keys = Object.keys(this.dataSource[0]);
            this.keys.sort();
            this.baseColoumns.map((res) => {
              if (this.keys.includes(res)) {
                if (this.keys.indexOf(res) > -1) {
                  this.keys.splice(this.keys.indexOf(res), 1);
                }
              }
            });
            this.keys.map((res) => {
              this.rowdata.push({ label: _.capitalize(res), value: res });
            });
          }
        } else {
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }

  getPackages() {
    let param = {
      companyId: this.companyId,
      pageNumber: this.pageNumber,
      isActive: this.isActive,
      pageSize: this.pageSize,
      orderDirection: this.Direction == undefined ? this.order : this.Direction,
      orderBy: this.orderDirection,
      search: this.search,
    };
    this.inventoryService.getShippingList(param).subscribe((res) => {
      this.tableData = res.body.data;
      this.loading = false;
    });
  }

  view(inventoryId) {
    this.viewProduct = true;
    this.router.navigate([`inventory/view-products/${inventoryId}`])
  }

  cancel() {
    this.display = false
  }

  deleteProduct(e) {
    this.inventoryService.deleteProduct(this.deleteId).subscribe(
      res => {
        this.toastrService.success('Success', 'Successfully Deleted')
        this.getProductList()
      },
      err => this.toastrService.error('Failed', 'Unsuccessfully Deleted')
    )
  }


  updateInventory(id) {
    let inventoryId = id
    this.router.navigate(['inventory/update-inventory'], { queryParams: { inventoryId: inventoryId } })
  }


  exportPdf() {

    // this.exportColumns = this.cols.map(col => ({
    //   title: col.header,
    //   dataKey: col.field
    // }));
    //     import("jspdf").then(jsPDF => {
    //         import("jspdf-autotable").then(x => {
    //             const doc = new jsPDF.default();
    //             doc.autoTable(this.exportColumns, this.tableData);
    //             doc.save('products.pdf');
    //         })
    //     })
  }

  onChange(e) {
    console.log(e)
  }

  fileChangeListener($event: any): void {
    let files = $event.srcElement.files;
    this.header = (this.header as unknown as string) === 'true' || this.header === true;
    // debugger;
    // this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',' })
    //   .pipe().subscribe((result: Array<any>) => {
    this.inventoryService.importProductViaExcel(files[0]).subscribe(res => {
      files = '';
      this.getProductList();
    })
    // }, (error: NgxCSVParserError) => {
    // });
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.tableData);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "products");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  showDialog(id) {
    this.deleteId = id;
    this.display = true
  }

}
