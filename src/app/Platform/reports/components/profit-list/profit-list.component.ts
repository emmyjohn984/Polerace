import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from 'src/app/Platform/inventory/services/inventory.service';
import { ReportsService } from '../../services/reports.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-profit-list',
  templateUrl: './profit-list.component.html',
  styleUrls: ['./profit-list.component.scss']
})
export class ProfitListComponent implements OnInit {
  userData: any;
  loading: boolean = false;
  data;
  productTitle: any = [];
  productID: any = [];
  title: any = '';
  startDate: any = 'null';
  endDate: any = 'null';
  calander2 = '';
  calander1 = '';
  lastDays: any = [
    { label: 'weekly', value: 7 },
    { label: 'monthly', value: 30 },
    { label: 'quaterly', value: 122 },
    { label: 'yearly', value: 365 }
  ]
  day: any = '';
  days: number = 0;
  productId: number = 0;
  date: any;
  date2: any;
  Difference_In_Days: any;
  di: any;
  reportsData: any = [];
  cols: any;
  keys: any;
  rowData: any = [];
  selectedColoumns: any[];
  baseColoumns = [
    'productName',
    'sku',
    'profit',
    'globalMarketplaceName',
    'bestOfferAutoAcceptPrice',
  ];
  constructor(
    private reportService: ReportsService,
    public inventoryService: InventoryService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.userData = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    )
    this.cols = [
      { field: 'productName', header: 'Product Name' },
      { field: 'sku', header: 'Product Code' },
      { field: 'buyPrice', header: 'Buy Price'},
      { field: 'sellingPrice', header: 'Selling Price'},
      { field: 'discount', header:'Discount'},
      { field: 'tax', header: 'Tax'},
      { field: 'profit', header: 'Profit' },
      { field: 'globalMarketplaceName', header: 'Channel' },
      { field: 'bestOfferAutoAcceptPrice', header: 'Best Offer' },
    ];
    this.getProductList();
    this.getProfitList(this.productId, this.days, this.startDate, this.endDate);
  }

  getData(value: any) {
    var formats = [
      moment.ISO_8601,
      "MM/DD/YYYY  :)  HH*mm*ss"
    ];
    let array = [];
    for (let i = 0; i < this.cols.length; i++) {
      if (!moment(value[this.cols[i].field], formats, true).isValid() || typeof value[this.cols[i].field] === 'number') {
        array.push(value[this.cols[i].field]);
      } else {
        array.push(moment(value[this.cols[i].field]).format('MM-DD-YYYY'));
      }
    }
    return array;
  }

  getProductList() {
    this.loading = true
    this.inventoryService
      .getProductList(this.userData.companyId)
      .subscribe(res => {
        this.data = res.body.data;
        let product = [];
        this.data.map(r => {
          this.productTitle.push({ label: r.products.title, value: r.products.productId })
          this.productID.push(r.products.productId);
        })
        this.loading = false
      })
  }
  
  getProfitList(productID, lastDays, startDate, endDate) {
    let data = {
      productId: productID,
      lastDays: lastDays,
      startDate: startDate,
      endDate: endDate
    }
    this.reportService.getProfitList(data).subscribe(res => {
      this.loading = true;
      if (res.body.data) {
        this.reportsData = res.body.data;
        this.loading = false;
        if (!this.keys) {
          this.keys = Object.keys(this.reportsData[0]);
          this.keys.sort()
          this.baseColoumns.map((res) => {
            if (this.keys.includes(res)) {
              if (this.keys.indexOf(res) > -1) {
                this.keys.splice(this.keys.indexOf(res), 1);
              }
            }
          });
          this.keys.map((res) => {
            this.rowData.push({ label: _.capitalize(res), value: res });
          });
        }
        this.loading = false;
      } else {
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.toastrService.error(
        'Something went wrong. Please try again later.'
      );
    })
  }

  secondDrop(event) {
    this.productId = event.value.products.productId;
    this.getProfitList(this.productId, this.days, this.startDate, this.endDate)
  }

  getLastDays(event) {
    if (event.value.value == 7) {
      this.startDate = moment(moment().startOf('isoWeek')).format('yyyy-MM-DD')
      this.endDate = moment(moment().endOf('isoWeek')).format('yyyy-MM-DD')
      this.calander1 = this.startDate;
      this.calander2 = this.endDate;
      this.days = event.value.value;
      this.di = event.value.value;
      this.getProfitList(this.productId, this.days, this.startDate, this.endDate)
    }
    //  else if(event.value.value==30){
    //     this.startDate=moment().subtract(event.value.value, 'days').calendar();
    //   }
    //   else if(event.value.value==30){
    //     this.startDate=moment().subtract(event.value.value, 'days').calendar();

    //   }
    else {
      // this.startDate=moment().subtract(event.value.value, 'days').calendar();
      // this.endDate=moment().;         
      let today = new Date()
      this.startDate = moment(moment().subtract(event.value.value, 'days').calendar()).format('yyyy-MM-DD');
      this.endDate = moment(today).format('yyyy-MM-DD')
      this.calander1 = this.startDate;
      this.calander2 = this.endDate;
      this.days = event.value.value;
      this.di = event.value.value;
      this.getProfitList(this.productId, this.days, this.startDate, this.endDate)

    }
  }

  val(e) {
    this.date = e.target.value;
  }

  val1(e) {
    this.date2 = e.target.value;
    var date1 = new Date(this.date);
    var date2 = new Date(this.date2);
    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();
    // To calculate the no. of days between two dates
    this.Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    if (this.Difference_In_Days > parseInt(this.di)) {
      if (this.di == 0) {
        this.dateSubmit();
      } else {
        this.toastrService.info(
          "Date difference should n't be greater than " +
          parseInt(this.di) +
          ' days '
        );
      }
    } else {
      this.dateSubmit();
    }
  }

  dateSubmit() {
    if (this.date > this.date2) {
      this.toastrService.info('Start Date can not be greater than End Date');
    } else if (this.Difference_In_Days > parseInt(this.di) && this.di != 0) {
      this.toastrService.info(
        "Date difference should n't be greater than " +
        parseInt(this.di) +
        ' days '
      );
    } else {
      this.startDate = this.date;
      this.endDate = this.date2;
      this.getProfitList(
        this.productId,
        this.days,
        this.startDate,
        this.endDate
      );
    }
  }

  productFilterReset() {
    this.title = '';
    // this.days = 0;
    // this.di = 0;
    this.productId = 0
    this.getProfitList(
      this.productId,
      this.days,
      this.startDate,
      this.endDate
    );
  }

  dayFilterReset() {
    this.day = '';
    this.days = 0;
    this.di = 0;
    this.startDate = null;
    this.endDate = null;
    this.calander1 = '';
    this.calander2 = '';
    this.getProfitList(
      this.productId,
      this.days,
      this.startDate,
      this.endDate
    );
  }

  dateFilterReset() {
    this.date = null;
    this.date2 = null;
    this.Difference_In_Days = null;
    this.calander2 = '';
    this.calander1 = '';
    this.startDate = null;
    this.endDate = null;
    this.getProfitList(
      this.productId,
      this.days,
      this.startDate,
      this.endDate
    );
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

    compare.map((res) => {
      this.cols.push({ field: res, header: _.capitalize(res) });
    });
    compare.map((res) => {
      this.baseColoumns.push(res);
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

}
