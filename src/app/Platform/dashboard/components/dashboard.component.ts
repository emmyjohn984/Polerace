import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/service/auth.service';
import { PermissionsHelper } from 'src/app/shared/helpers/permissions-helper';
import { InventoryService } from '../../inventory/services/inventory.service';
import { MarketplacesService } from '../../marketplaces/services/marketplaces.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { ChartType } from 'chart.js';
import { Colors } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  loading: boolean = false;
  dataSource: any;
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
  orders: any;
  colors: any;
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
  constructor(
    private router: Router,
    private authService: AuthService,
    private permissionsHelper: PermissionsHelper,
    private innventoryService: InventoryService,
    private marketplaceService: MarketplacesService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.userData = localStorage.getItem('currentUser')
      ? JSON.parse(localStorage.getItem('currentUser'))
      : JSON.parse(sessionStorage.getItem('currentUser'));
    this.companyId = this.userData.companyId;
    if (this.userData.roleId != 3) {
      this.router.navigateByUrl('dashboard/staffdashboard');
    }
    if (this.userData.roleId == 3) {
      this.getTopSoldProducts();
      this.getRecentOrders();
      this.getProductInsights();
      this.getSaleStats();
    }
  }

  public chartType: string = 'pie';
  public chartLabels: Array<string> = ['Session1', 'Session2'];
  public chartData: Array<number> = [21, 30];
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

  getProductInsights() {
    this.innventoryService
      .graphData(this.userData.companyId, this.marketid)
      .subscribe((res) => {
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
      });
  }

  // Line Chart
  public lineChartData: ChartDataSets[] = [
    {
      data: [
        20,
        20,
        45,
        78,
        65,
        96,
        45,
        23,
        45,
        10,
        12,
        45,
        ,
        78,
        12,
        86,
        45,
        78,
        2,
        65,
        86,
        0,
        0,
        0,
        8,
        8,
        6,
        33,
        0,
        78,
        36,
        99,
        0,
        75,
      ],
      label: 'Session 1',
    },
    {
      data: [
        40,
        11,
        13,
        45,
        85,
        96,
        74,
        74,
        52,
        89,
        41,
        25,
        75,
        85,
        96,
        41,
        22,
        55,
        77,
        41,
        22,
        0,
        0,
        78,
        36,
        99,
        45,
        3,
        9,
        0,
        0,
        0,
        45,
        0,
        0,
        88,
      ],
      label: 'Session 2',
    },
  ];
  public lineChartLabels: Label[] = [
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
    'Day31',
  ];
  public lineChartColors: Color[] = [];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  getSaleStats() {
    this.marketplaceService
      .getStatistics(this.userData.companyId)
      .subscribe((res) => {
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
        this.lineChartData[2]?.data.push(
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
        if (this.lineChartData[0].data.length != 0) {
          // this.lineChartData[0].label.push('Amazon')
          // this.lineChartLabels.push('Day1', 'Day2', 'Day3', 'Day4', 'Day5', 'Day6', 'Day7','Day8','Day9','Day10','Day11','Day12','Day13','Day14','Day15','Day16','Day17','Day18','Day19','Day20','Day21','Day22','Day23','Day24','Day25','Day26','Day27','Day28','Day29','Day30','Day31')
        }
        if (this.lineChartData[1].data.length != 0) {
          // this.lineChartData[1].label.push('Ebay')
        }
        if (this.lineChartData[2]?.data.length != 0) {
          // this.lineChartData[2].label.push('Walmart')
        }
      });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUser');
    window.location.reload(); //workaround- need correction
    // this.router.navigate(['./auth/login']);
  }

  getTopSoldProducts() {
    let companyId = this.userData.companyId,
      day = 0,
      globalmarketId = 0,
      startDate = null,
      endDate = null;
    this.innventoryService
      .channelData(companyId, day, globalmarketId, startDate, endDate)
      .subscribe(
        (res) => {
          this.dataSource = res.body.data;
        },
        (err) => {
          console.log(err);
          this.notificationService.Error(
            'Something went wrong. Please try again later.'
          );
        }
      );
  }

  getRecentOrders() {
    this.loading = true;
    let param = {
      companyId: this.companyId,
      PageNumber: this.pageNumber,
      PageSize: this.pageSize,
      OrderBy: this.orderBy,
      OrderDirection: this.OrderDirection,
      globalmarketId: this.marketid,
      Search: this.Search,
    };
    this.marketplaceService
      .getAllOrdersFromDiffrentMarketPlaces(param)
      .subscribe(
        (res) => {
          if (res.body.data != null) this.orders = res.body.data;
          this.loading = false;
        },
        (err) => {
          this.loading = false;
          this.notificationService.Error(
            'Something went wrong. Please try again later.'
          );
        }
      );
  }
}
