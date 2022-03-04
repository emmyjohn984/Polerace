import { Component, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { MarketplacesService } from 'src/app/Platform/marketplaces/services/marketplaces.service';
import { ChartDataSets } from 'chart.js';
import { Router } from '@angular/router';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService } from '../../services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { Color, Colors, Label } from 'ng2-charts';
import * as _ from 'lodash';
import * as moment from 'moment';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-product-insights',
  templateUrl: './product-insights.component.html',
  styleUrls: ['./product-insights.component.scss'],
})
export class ProductInsightsComponent implements OnInit {
  lineData: any = [];
  date: any;
  date2: any;
  data: any;
  loading: boolean = false;
  topSelling: any = [];
  marketplaces: any;
  marketid: any = 0;
  day: any = '';
  public chartType2: string = 'line';
  data2: any = [];
  title: any;
  totalRecords: any;
  orderStatus: any;
  globalmarketId: number = 0;
  marketId: number = 0;
  days: number = 0;
  startDate: any = 'null';
  endDate: any = 'null';
  changeData: any;
  totalCount: number = 0;
  totalPending: number = 0;
  totalReceived: number = 0;
  globalMarketplace = '';
  calander2 = '';
  calander1 = '';
  totalShipped: number = 0;
  chartDatasets: any = [];
  chartColors2: any = [];
  chartDatasets2: any = [];
  chartLabels2: any = [];
  chartOptions2: any = [];
  globalMarketplaceName: any = [];
  globalMarketplaceMonth: any = [];
  d: any;
  di: any;
  daysArr: any;
  userData: any;
  Difference_In_Days: any;
  amazonData: any;
  amazonday1: any;
  amazonday2: any;
  amazonday3: any;
  amazonday4: any;
  amazonday5: any;
  amazonday6: any;
  amazonday7: any;
  amazonday8: any;
  amazonday9: any;
  amazonday10: any;
  amazonday11: any;
  amazonday12: any;
  amazonday13: any;
  amazonday14: any;
  amazonday15: any;
  amazonday16: any;
  amazonday17: any;
  amazonday18: any;
  amazonday19: any;
  amazonday20: any;
  amazonday21: any;
  amazonday22: any;
  amazonday23: any;
  amazonday24: any;
  amazonday25: any;
  amazonday26: any;
  amazonday27: any;
  amazonday28: any;
  amazonday29: any;
  amazonday30: any;
  amazonday31: any;
  ebayday1: any;
  ebayday2: any;
  ebayday3: any;
  ebayday4: any;
  ebayday5: any;
  ebayday6: any;
  ebayday7: any;
  ebayday8: any;
  ebayday9: any;
  ebayday10: any;
  ebayday11: any;
  ebayday12: any;
  ebayday13: any;
  ebayday14: any;
  ebayday15: any;
  ebayday16: any;
  ebayday17: any;
  ebayday18: any;
  ebayday19: any;
  ebayday20: any;
  ebayday21: any;
  ebayday22: any;
  ebayday23: any;
  ebayday24: any;
  ebayday25: any;
  ebayday26: any;
  ebayday27: any;
  ebayday28: any;
  ebayday29: any;
  ebayday30: any;
  ebayday31: any;
  walmartday1: any;
  walmartday2: any;
  walmartday3: any;
  walmartday4: any;
  walmartday5: any;
  walmartday6: any;
  walmartday7: any;
  walmartday8: any;
  walmartday9: any;
  walmartday10: any;
  walmartday11: any;
  walmartday12: any;
  walmartday13: any;
  walmartday14: any;
  walmartday15: any;
  walmartday16: any;
  walmartday17: any;
  walmartday18: any;
  walmartday19: any;
  walmartday20: any;
  walmartday21: any;
  walmartday22: any;
  walmartday23: any;
  walmartday24: any;
  walmartday25: any;
  walmartday26: any;
  walmartday27: any;
  walmartday28: any;
  walmartday29: any;
  walmartday30: any;
  walmartday31: any;
  Days: any = [{ day: 7, label: '7 Days' }, { day: 30, label: '30 Days' }, { day: 45, label: '45 Days' }, { day: 60, label: '60 Days' }];
  cols: any;
  keys: any;
  rowData: any = [];
  baseColoumns = [
    'productName',
    'sku',
    'totalQuantity',
    'price'
  ];
  form: FormGroup = new FormGroup({});

  constructor(
    private marketplaceService: MarketplacesService,
    private toastrService: ToastrService,
    ngbConfig: NgbConfig,
    ngbAlertConfig: NgbAlertConfig,
    private marketplacesService: MarketplacesService,
    private router: Router,
    private fb: FormBuilder,
    private inventoryService: InventoryService
  ) {
    ngbConfig.animation = false;
    ngbAlertConfig.animation = false;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      columns: [this.baseColoumns]
    });
    this.userData = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    this.cols = [
      { field: 'productName', header: 'Product Name' },
      { field: 'sku', header: 'SKU' },
      { field: 'totalQuantity', header: 'Total Quantity' },
      { field: 'price', header: 'Price' }
    ];
    this.GetGlobalMarketplaceData();
    this.getProductInsights(this.globalmarketId);
    this.channelData(
      this.userData.companyId,
      this.days,
      this.marketId,
      this.startDate,
      this.endDate
    );
    this.getSaleStats();
  }

  channelData(companyId, day, marketId, startDate, endDate) {
    this.loading = true;
    this.inventoryService
      .channelData(companyId, day, marketId, startDate, endDate)
      .subscribe(
        (res) => {
          this.data2 = res.body.data;
          if (!this.keys) {
            this.keys = Object.keys(this.data2[0]);
            this.keys.sort();
            this.keys.map((res) => {
              this.rowData.push({ label: _.capitalize(res), value: res });
            });
          }
          this.loading = false;
        },
        (err) => {
          this.loading = false;
          this.toastrService.error(
            'Something went wrong. Please try again later.'
          );
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

  addColoumns(e?) {
    let Array = [];
    this.form.value.columns.map((res) => {
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

  onMarketplaceChange(e) {
    this.marketId = e.target.value;
    this.channelData(
      this.userData.companyId,
      this.days,
      this.marketId,
      this.startDate,
      this.endDate
    );
  }

  secondDrop(e) {
    console.log(e);
    console.log(e.target.value)
    if (e.target.value == 7) {
      this.startDate = moment(moment().startOf('isoWeek')).format('yyyy-MM-DD')
      this.endDate = moment(moment().endOf('isoWeek')).format('yyyy-MM-DD')
      this.calander1 = this.startDate;
      this.calander2 = this.endDate;
      this.days = e.target.value;
      this.di = e.target.value;
      this.channelData(this.userData.companyId, this.days, this.marketId, this.startDate, this.endDate);
    }
    else {
      let today = new Date()
      this.startDate = moment(today).format('yyyy-MM-DD');
      this.endDate = moment(today.setDate(today.getDate() + e)).format('yyy-MM-DD');
      this.calander1 = this.startDate;
      this.calander2 = this.endDate;
      this.days = e.target.value;
      this.di = e.target.value;
      this.channelData(this.userData.companyId, this.days, this.marketId, this.startDate, this.endDate);
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
      this.globalmarketId = this.d === undefined ? this.globalmarketId : this.d;
      this.startDate = this.date;
      this.endDate = this.date2;
      this.channelData(
        this.userData.companyId,
        this.days,
        this.marketId,
        this.startDate,
        this.endDate
      );
    }
  }

  // For Pie Chart

  public chartType: string = 'pie';
  public chartLabels: Array<string> = [];
  public chartData: Array<number> = [];
  public chartColors: Colors[] = [
    {
      backgroundColor: ['#42A5F5', 'red', '#FFA726', '#FF6384'],
    },
  ];
  public chartOptions: any = {
    pieceLabel: {
      render: function (args) {
        const label = args.label,
          value = args.value;
        return label + ': ' + value;
      },
    },
  };

  getProductInsights(marketid) {
    this.inventoryService
      .graphData(this.userData.companyId, marketid)
      .subscribe(
        (res) => {
          if (res.body.data.totalPending != 0) {
            this.chartLabels.push('Pending');
            this.chartData.push(res.body.data.totalPending);
          }
          if (res.body.data.totalShipped != 0) {
            this.chartLabels.push('Shipped');
            this.chartData.push(res.body.data.totalShipped);
          }
          if (res.body.data.totalReceived != 0) {
            this.chartLabels.push('Recived');
            this.chartData.push(res.body.data.totalReceived);
          }
        },
        (err) => {
          this.loading = false;
          this.toastrService.error(
            'Something went wrong .Please try again later.'
          );
        }
      );
  }

  // For Line Chart

  public lineChartData: ChartDataSets[] = [
    { data: [], label: '' },
    { data: [], label: '' },
    { data: [], label: '' },
  ];
  public lineChartLabels: Label[] = [];

  public lineChartColors: Color[] = [];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  getSaleStats() {
    this.marketplaceService.getStatistics(this.userData.companyId).subscribe((res) => {
      this.amazonData = res.body.data;
      this.amazonday1 = this.amazonData[0]?.day1;
      this.amazonday2 = this.amazonData[0]?.day2;
      this.amazonday3 = this.amazonData[0]?.day3;
      this.amazonday4 = this.amazonData[0]?.day4;
      this.amazonday5 = this.amazonData[0]?.day5;
      this.amazonday6 = this.amazonData[0]?.day6;
      this.amazonday7 = this.amazonData[0]?.day7;
      this.amazonday8 = this.amazonData[0]?.day8;
      this.amazonday9 = this.amazonData[0]?.day9;
      this.amazonday10 = this.amazonData[0]?.day10;
      this.amazonday11 = this.amazonData[0]?.day11;
      this.amazonday12 = this.amazonData[0]?.day12;
      this.amazonday13 = this.amazonData[0]?.day13;
      this.amazonday14 = this.amazonData[0]?.day14;
      this.amazonday15 = this.amazonData[0]?.day15;
      this.amazonday16 = this.amazonData[0]?.day16;
      this.amazonday17 = this.amazonData[0]?.day17;
      this.amazonday18 = this.amazonData[0]?.day18;
      this.amazonday19 = this.amazonData[0]?.day19;
      this.amazonday20 = this.amazonData[0]?.day20;
      this.amazonday21 = this.amazonData[0]?.day21;
      this.amazonday22 = this.amazonData[0]?.day22;
      this.amazonday23 = this.amazonData[0]?.day23;
      this.amazonday24 = this.amazonData[0]?.day24;
      this.amazonday25 = this.amazonData[0]?.day25;
      this.amazonday26 = this.amazonData[0]?.day26;
      this.amazonday27 = this.amazonData[0]?.day27;
      this.amazonday28 = this.amazonData[0]?.day28;
      this.amazonday29 = this.amazonData[0]?.day29;
      this.amazonday30 = this.amazonData[0]?.day30;
      this.amazonday31 = this.amazonData[0]?.day31;
      this.ebayday1 = this.amazonData[1]?.day1;
      this.ebayday2 = this.amazonData[1]?.day2;
      this.ebayday3 = this.amazonData[1]?.day3;
      this.ebayday4 = this.amazonData[1]?.day4;
      this.ebayday5 = this.amazonData[1]?.day5;
      this.ebayday6 = this.amazonData[1]?.day6;
      this.ebayday7 = this.amazonData[1]?.day7;
      this.ebayday8 = this.amazonData[1]?.day8;
      this.ebayday9 = this.amazonData[1]?.day9;
      this.ebayday10 = this.amazonData[1]?.day10;
      this.ebayday11 = this.amazonData[1]?.day11;
      this.ebayday12 = this.amazonData[1]?.day12;
      this.ebayday13 = this.amazonData[1]?.day13;
      this.ebayday14 = this.amazonData[1]?.day14;
      this.ebayday15 = this.amazonData[1]?.day15;
      this.ebayday16 = this.amazonData[1]?.day16;
      this.ebayday17 = this.amazonData[1]?.day17;
      this.ebayday18 = this.amazonData[1]?.day18;
      this.ebayday19 = this.amazonData[1]?.day19;
      this.ebayday20 = this.amazonData[1]?.day20;
      this.ebayday21 = this.amazonData[1]?.day21;
      this.ebayday22 = this.amazonData[1]?.day22;
      this.ebayday23 = this.amazonData[1]?.day23;
      this.ebayday24 = this.amazonData[1]?.day24;
      this.ebayday25 = this.amazonData[1]?.day25;
      this.ebayday26 = this.amazonData[1]?.day26;
      this.ebayday27 = this.amazonData[1]?.day27;
      this.ebayday28 = this.amazonData[1]?.day28;
      this.ebayday29 = this.amazonData[1]?.day29;
      this.ebayday30 = this.amazonData[1]?.day30;
      this.ebayday31 = this.amazonData[1]?.day31;
      this.walmartday1 = this.amazonData[2]?.day1;
      this.walmartday2 = this.amazonData[2]?.day2;
      this.walmartday3 = this.amazonData[2]?.day3;
      this.walmartday4 = this.amazonData[2]?.day4;
      this.walmartday5 = this.amazonData[2]?.day5;
      this.walmartday6 = this.amazonData[2]?.day6;
      this.walmartday7 = this.amazonData[2]?.day7;
      this.walmartday8 = this.amazonData[2]?.day8;
      this.walmartday9 = this.amazonData[2]?.day9;
      this.walmartday10 = this.amazonData[2]?.day10;
      this.walmartday11 = this.amazonData[2]?.day11;
      this.walmartday12 = this.amazonData[2]?.day12;
      this.walmartday13 = this.amazonData[2]?.day13;
      this.walmartday14 = this.amazonData[2]?.day14;
      this.walmartday15 = this.amazonData[2]?.day15;
      this.walmartday16 = this.amazonData[2]?.day16;
      this.walmartday17 = this.amazonData[2]?.day17;
      this.walmartday18 = this.amazonData[2]?.day18;
      this.walmartday19 = this.amazonData[2]?.day19;
      this.ebayday20 = this.amazonData[2]?.day20;
      this.walmartday21 = this.amazonData[2]?.day21;
      this.walmartday22 = this.amazonData[2]?.day22;
      this.walmartday23 = this.amazonData[2]?.day23;
      this.walmartday24 = this.amazonData[2]?.day24;
      this.walmartday25 = this.amazonData[2]?.day25;
      this.walmartday26 = this.amazonData[2]?.day26;
      this.walmartday27 = this.amazonData[2]?.day27;
      this.walmartday28 = this.amazonData[2]?.day28;
      this.walmartday29 = this.amazonData[2]?.day29;
      this.walmartday30 = this.amazonData[2]?.day30;
      this.walmartday31 = this.amazonData[2]?.day31;
      if (this.amazonData[0] != null) {
        this.lineChartData[0].data.push(
          this.amazonday1,
          this.amazonday2,
          this.amazonday3,
          this.amazonday4,
          this.amazonday5,
          this.amazonday6,
          this.amazonday7,
          this.amazonday8,
          this.amazonday9,
          this.amazonday10,
          this.amazonday11,
          this.amazonday12,
          this.amazonday13,
          this.amazonday14,
          this.amazonday15,
          this.amazonday16,
          this.amazonday17,
          this.amazonday18,
          this.amazonday19,
          this.amazonday20,
          this.amazonday21,
          this.amazonday22,
          this.amazonday23,
          this.amazonday24,
          this.amazonday25,
          this.amazonday26,
          this.amazonday27,
          this.amazonday28,
          this.amazonday29,
          this.amazonday30,
          this.amazonday31
        );
        this.lineChartData[0].label = this.amazonData[0].globalMarketplaceName;
        this.lineChartLabels.push(
          'Day1',
          'Day2',
          'Day3',
          'Day4',
          'Day5',
          'Day6',
          'Day7',
          'Day8',
          'Day9',
          'Day10',
          'Day11',
          'Day12',
          'Day13',
          'Day14',
          'Day15',
          'Day16',
          'Day17',
          'Day18',
          'Day19',
          'Day20',
          'Day21',
          'Day22',
          'Day23',
          'Day24',
          'Day25',
          'Day26',
          'Day27',
          'Day28',
          'Day29',
          'Day30',
          'Day31'
        );
      }
      if (this.amazonData[1] != null) {
        this.lineChartData[1].data.push(
          this.ebayday1,
          this.ebayday2,
          this.ebayday3,
          this.ebayday4,
          this.ebayday5,
          this.ebayday6,
          this.ebayday7,
          this.ebayday8,
          this.ebayday9,
          this.ebayday10,
          this.ebayday11,
          this.ebayday12,
          this.ebayday13,
          this.ebayday14,
          this.ebayday15,
          this.ebayday16,
          this.ebayday17,
          this.ebayday18,
          this.ebayday19,
          this.ebayday20,
          this.ebayday21,
          this.ebayday22,
          this.ebayday23,
          this.ebayday24,
          this.ebayday25,
          this.ebayday26,
          this.ebayday27,
          this.ebayday28,
          this.ebayday29,
          this.ebayday30,
          this.ebayday31
        );
        this.lineChartData[1].label = this.amazonData[1].globalMarketplaceName;
      }
      if (this.amazonData[2] != null) {
        this.lineChartData[2].data.push(
          this.walmartday1,
          this.walmartday2,
          this.walmartday3,
          this.walmartday4,
          this.walmartday5,
          this.walmartday6,
          this.walmartday7,
          this.walmartday8,
          this.walmartday9,
          this.walmartday10,
          this.walmartday11,
          this.walmartday12,
          this.walmartday13,
          this.walmartday14,
          this.walmartday15,
          this.walmartday16,
          this.walmartday17,
          this.walmartday18,
          this.walmartday19,
          this.walmartday20,
          this.walmartday21,
          this.walmartday22,
          this.walmartday23,
          this.walmartday24,
          this.walmartday25,
          this.walmartday26,
          this.walmartday27,
          this.walmartday28,
          this.walmartday29,
          this.walmartday30,
          this.walmartday31
        );
        this.lineChartData[2].label = this.amazonData[2].globalMarketplaceName;
      }
    },
      (err) => {
        this.loading = false;
        this.toastrService.error(
          'Something went wrong. Please try again later.'
        );
      }
    );
  }

  chartClicked(e: any): void { }
  chartHovered(e: any): void { }

  async dropDowngraphData(val) {
    let arr: any = [];

    await this.inventoryService
      .graphData(this.userData.companyId, val)
      .subscribe((res) => {
        arr = res.body.data;
        this.totalCount = arr.totalCount;
        this.totalPending = arr.totalPending;
        this.totalReceived = arr.totalReceived;
        this.totalShipped = arr.totalShipped;
      });
  }

  GetGlobalMarketplaceData() {
    this.inventoryService.GetGlobalMarketplaceData().subscribe(
      (res) => {
        this.data = res.body.data;
        this.marketplaces = res.body.data;
      },
      (err) => {
        this.toastrService.error(
          'Something went wrong. Please try again later.'
        );
      }
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
    this.channelData(
      this.userData.companyId,
      this.days,
      this.marketId,
      this.startDate,
      this.endDate
    );
  }

  marketFilterReset() {
    this.globalMarketplace = '';
    this.marketId = 0;
    this.channelData(
      this.userData.companyId,
      this.days,
      this.marketId,
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
    this.channelData(
      this.userData.companyId,
      this.days,
      this.marketId,
      this.startDate,
      this.endDate
    );
  }

  all(val) {
    let arr: any = [];
    this.inventoryService
      .graphData(this.userData.companyId, val)
      .subscribe((res) => {
        arr = res.body.data;
        this.totalCount = arr.totalCount;
        this.totalPending = arr.totalPending;
        this.totalReceived = arr.totalReceived;
        this.totalShipped = arr.totalShipped;
      });
  }

  onChnnelChangeData(e) {
    this.d = e.target.value;
    this.chartData = [];
    this.chartLabels = [];
    this.days = this.di === undefined ? this.days : this.di;
    this.inventoryService
      .channelData(
        this.userData.companyId,
        this.days,
        e.target.value,
        this.startDate,
        this.endDate
      )
      .subscribe((res) => {
        this.data2 = res.body.data;
      });
    this.getProductInsights(e.target.value);
  }

  chartClicked2(e: any): void { }
  chartHovered2(e: any): void { }

  update() {
    let color = '#';
    let str = '0123456789ABCDEF';
    for (let i = 0; i <= this.lineData.length - 1; i++) {
      color += str[Math.floor(Math.random() * 16)];
      this.chartDatasets2.push({
        data: [
          this.lineData[i].day1,
          this.lineData[i].day2,
          this.lineData[i].day3,
          this.lineData[i].day4,
          this.lineData[i].day5,
          this.lineData[i].day6,
          this.lineData[i].day7,
          this.lineData[i].day8,
          this.lineData[i].day9,
          this.lineData[i].day10,
          this.lineData[i].day11,
          this.lineData[i].day12,
          this.lineData[i].day13,
          this.lineData[i].day14,
          this.lineData[i].day15,
          this.lineData[i].day16,
          this.lineData[i].day17,
          this.lineData[i].day18,
          this.lineData[i].day19,
          this.lineData[i].day20,
          this.lineData[i].day21,
          this.lineData[i].day22,
          this.lineData[i].day23,
          this.lineData[i].day24,
          this.lineData[i].day25,
          this.lineData[i].day26,
          this.lineData[i].day27,
          this.lineData[i].day28,
          this.lineData[i].day29,
          this.lineData[i].day30,
          this.lineData[i].day31,
        ],

        label: this.lineData[i].globalMarketplaceName,
      });
    }
  }
}
