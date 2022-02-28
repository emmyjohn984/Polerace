import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { MarketplacesService } from '../../services/marketplaces.service';
import { FormBuilder, FormGroup} from '@angular/forms';
import * as XLSX from 'xlsx';
import { Subject, Observable } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as _ from 'lodash';
import * as moment from 'moment';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-orders-from-diff-marketplaces',
  templateUrl: './orders-from-diff-marketplaces.component.html',
  styleUrls: ['./orders-from-diff-marketplaces.component.scss'],
})
export class OrdersFromDiffMarketplacesComponent implements OnInit {
  deleteId: number;
  AllOrders: any;
  dataSource: any;
  marketplaces: [];
  marketplace1;
  Orders: any;
  filterOn: boolean = false;
  all: boolean = false;
  loading: boolean = false;
  globalMarketplaceId: number;
  globalMarketplaceName: any = '';
  marketid: number = 0;
  userData: any;
  companyId: number;
  Search: string = null;
  orderBy: any = 'orderId';
  OrderDirection: any = 'asc';
  pageSize: number = 10;
  pageNumber: number = 1;
  totalRecords: number = 0;
  globalmarketplacearray: Array<any> = [];
  myarray: Array<any> = [];
  myarray1: Array<any> = [];
  myarray2: Array<any> = [];
  myarray3: Array<any> = [];
  myarray4: Array<any> = [];
  main: Array<any> = [];
  main1: Array<any> = [];
  both: Array<any> = [];
  EbayOrders: any;
  filterEbay: any;
  EbayId: number;
  filterAmazon: any;
  AmazonId: number;
  AmazonOrders: any;
  filterWallmart: any;
  WallmartId: number;
  WallmartOrders: any;
  filterShoppify: any;
  ShoppifyId: number;
  ShoppifyOrders: any;
  calculateloop: any;
  loopLength: number;
  selectedRecord: any;
  csvRecords: any[] = [];
  header: boolean = false;
  isExcelFile: boolean;
  spinnerEnabled = false;
  keys: string[];
  exceldata: Array<any> = [];
  dataSheet = new Subject();
  @ViewChild('inputFile') inputFile: ElementRef;
  cols: any;
  key: any;
  rowData: any = [];
  baseColoumns = [
    'productName',
    'sku',
    'price',
    'totalQuantity',
    'orderStatus',
    'globalMarketplaceName',
    'createdDate'
  ];
  form: FormGroup = new FormGroup({});

  constructor(
    private marketplaceService: MarketplacesService,
    private router: Router,
    private notificationService: NotificationService,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      columns: [this.baseColoumns]
    });
    this.userData = localStorage.getItem('currentUser')
      ? JSON.parse(localStorage.getItem('currentUser'))
      : JSON.parse(sessionStorage.getItem('currentUser'));
    this.companyId = this.userData.companyId;
    this.cols = [
      { field: 'productName', header: 'Product Name' },
      { field: 'sku', header: 'Product Code' },
      { field: 'price', header: 'Price' },
      { field: 'totalQuantity', header: 'Quantity' },
      { field: 'orderStatus', header: 'Order Status' },
      { field: 'globalMarketplaceName', header: 'Channel' },
      { field: 'createdDate', header: 'createdDate' }
    ]
    this.getAllOrdersFromDiifrentMarketPlaces();
  }

  exportExcel() {
    this.loading = true;
    let param = {
      companyId: this.companyId,
      globalmarketId:
        this.globalMarketplaceId == undefined ? '0' : this.globalMarketplaceId,
      Search: this.Search,
    };
    this.marketplaceService
      .exportOrdersFromDiffrentMarketPlaces(param)
      .subscribe((res) => {
        if (res.body.data != null) {
          res.body.data.map((data: any) => {
            this.exceldata.push({
              id: data.id,
              orderId: data.orderId,
              sku: data.sku,
              productName: data.productName,
              price: data.price,
              orderStatus: data.orderStatus,
              totalQuantity: data.totalQuantity,
              tax: data.tax,
              globalMarketplaceName: data.globalMarketplaceName,
              userMarketplaceName: data.userMarketplaceName,
              createdDate: data.createdDate,
            });
          });
          this.exportAsExcelFile(res.body.data, 'export-to-excel');
        } else {
          this.notificationService.Error(
            'Something went wrong. Please try again later.'
          );
          this.loading = false;
        }
      });
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
    this.loading = false;
  }

  getAllOrdersFromDiifrentMarketPlaces() {
    this.loading = true;
    let param = {
      companyId: this.companyId,
      PageNumber: this.pageNumber,
      PageSize: this.pageSize,
      OrderBy: this.orderBy,
      OrderDirection: this.OrderDirection,
      globalmarketId: this.globalMarketplaceId == undefined ? this.marketid: this.globalMarketplaceId,
      Search: this.Search,
    };
    this.marketplaceService
      .getAllOrdersFromDiffrentMarketPlaces(param)
      .subscribe(
        (res) => {
          if (res.body.data != null) {
            this.dataSource = res.body.data;
            this.Orders = this.dataSource;
            this.loading = false;
            if (!this.key) {
              this.key = Object.keys(this.dataSource[0]);
              this.key.map((res) => {
                this.rowData.push({ label: _.capitalize(res), value: res });
              });
            }
            this.totalRecords = res.body.data[0]?.totalRecords;
          }
          this.loading = false;
          this.getAllGlobalMarketPlace();
        },
        (err) => {
          console.log(err);
          this.notificationService.Error(
            'Something went wrong. Please try again later.'
          );
          this.loading = false;
        }
      );
  }

  getData(value: any) {
    var formats = [
      moment.ISO_8601,
      "MM/DD/YYYY  :)  HH*mm*ss"
    ];
    let array = [];
    for (let i = 0; i < this.cols.length; i++) {
      if (!moment(value[this.cols[i].field], formats, true).isValid() || typeof value[this.cols[i].field] === 'number') {
        if(this.cols[i].field == 'isActive'){
          if(!!value[this.cols[i].field]){
            array.push('Active');
          }else{
            array.push('In-Active');
          }
        }else{
          array.push(value[this.cols[i].field]);
        }
      } else {
        array.push(moment(value[this.cols[i].field]).format('MM-DD-YYYY'));
      }
    }
    return array;
  }

  addColoumns(e?) {
    let Array = [];
    this.form.value.columns.map((res) => {
      Array.push(res);
    });
    let  columns = [];
    this.cols.map((res) => {
      columns.push(res.field);
    });

    let compare = Array.filter((val) => !columns.includes(val));
    compare.map(res=>{this.baseColoumns.push(res)});

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

  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne.id === objTwo.id;
    }
  }

  getAllGlobalMarketPlace() {
    this.marketplaceService.getAllGlobalMarketPlace().subscribe((res) => {
      this.marketplaces = res.body.data;
      this.loading = false;
    });
  }

  filterReset() {
    this.filterOn = false;
    this.globalMarketplaceId = 0;
    this.globalMarketplaceName = '';
    this.getAllOrdersFromDiifrentMarketPlaces();
  }

  onMarketplaceChange(event) {
    this.filterOn = true;
    this.globalMarketplaceId = event;
    let param = {
      companyId: this.companyId,
      PageNumber: this.pageNumber,
      PageSize: this.pageSize,
      OrderBy: this.orderBy,
      OrderDirection: this.OrderDirection,
      globalmarketId: this.globalMarketplaceId,
      Search: this.Search,
    };
    this.marketplaceService
      .getOrdersFromDiffrentMarketPlaces(param)
      .subscribe((res) => {
        this.loading = true;
        if (res.body.data) {
          this.loading = false;
          this.dataSource = res.body.data;
          this.Orders = this.dataSource;
          this.totalRecords = res.body.data[0]?.totalRecords;
        }else{
          this.loading=false;
        }
      },err=>{
        this.notificationService.Error('Something went wrong. Please try again later.');
        this.loading=false;
      });
  }

  showId(id) {}

  view(orderId, globalMarketplaceId) {
    this.router.navigate(['/marketplaces/viewchannelorder'], {
      queryParams: {
        orderId: orderId,
        globalMarketplaceId: globalMarketplaceId,
      },
    });
  }

  loadOrders(e) {
    this.loading = true;
    this.orderBy = e.sortField == undefined ? 'orderId' : e.sortField;
    this.OrderDirection = e.sortOrder == 1 ? 'asc' : 'desc';
    this.Search = e.globalFilter;
    this.pageNumber = e.first / e.rows + 1;
    this.pageSize = e.rows;
    this.getAllOrdersFromDiifrentMarketPlaces();
  }

  selectOrders(orderId, globalmarketId) {
    this.main.push({ globalmarketId: globalmarketId, orderId: orderId });
  }

  onSubmit() {
    if (this.main.length > 0 || this.main1.length > 0) {
      this.loading = true;
      if (this.main1.length === 0) {
        this.marketplaceService.updateStatusOrder(this.main).subscribe(
          (res) => {
            if (res.body.status === 200) {
              this.getAllOrdersFromDiifrentMarketPlaces();
              this.loading = false;
              this.router.navigate(['/']).then(() => {
                this.router.navigate([
                  'marketplaces/manageordersfromglobalmarketplaces',
                ]);
              });
              this.notificationService.Success(res.body.message);
            }
          },
          (err) => {
            console.log(err);
            this.loading = false;
            this.notificationService.Error(
              'Something went wrong. Please try again later.'
            );
          }
        );
      } else {
        this.marketplaceService.updateStatusOrder(this.main1).subscribe(
          (res) => {
            if (res.body.status === 200) {
              this.getAllOrdersFromDiifrentMarketPlaces();
              this.loading = false;
              this.router.navigate(['/']).then(() => {
                this.router.navigate([
                  'marketplaces/manageordersfromglobalmarketplaces',
                ]);
              });
              this.notificationService.Success(res.body.message);
            }
          },
          (err) => {
            console.log(err);
            this.loading = false;
            this.notificationService.Error(
              'Something went wrong. Please try again later.'
            );
          }
        );
      }
    }
  }

  select() {
    this.selectedRecord.map((data: any) => {
      this.main1.push({
        globalmarketId: data.globalMarketplaceId,
        orderId: data.orderId,
      });
    });
  }

  fileChangeListener(evt: any): void {
    let data, header;
    const target: DataTransfer = <DataTransfer>evt.target;
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = '';
    }
    if (this.isExcelFile) {
      this.spinnerEnabled = true;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        data = XLSX.utils.sheet_to_json(ws);
      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.spinnerEnabled = false;
        this.keys = Object.keys(data[0]);
        this.keys.sort();
        this.dataSheet.next(data);
      };
    } else {
      this.inputFile.nativeElement.value = '';
    }
  }
}
