import { AfterViewInit, Component, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MarketplacesService } from '../../services/marketplaces.service';
import { PermissionsHelper } from 'src/app/shared/helpers/permissions-helper';
import * as moment from 'moment';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-manage-sales-channels',
  templateUrl: './manage-sales-channels.component.html',
  styleUrls: ['./manage-sales-channels.component.scss']
})

export class ManageSalesChannelsComponent implements AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['name', 'channel', 'status', 'expiredOn', "actions"];
  dataSource : any;
  salesChannels: Array<any> = [];
  userData: any = {};
  userRole: string
  deleteId: number;
  loading :boolean =false;
  cols: any;
  keys: any;
  rowData: any = [];
  baseColoumns = [
    'userMarketplaceName',
    'globalMarketplaceName',
    'expiredOn',
    'isActive',
  ];
  form: FormGroup = new FormGroup({});

  constructor(private router: Router, private notificationService: NotificationService,
    private dialog: MatDialog,private fb: FormBuilder, private marketplacesService: MarketplacesService, public permissionsHelper: PermissionsHelper) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      columns: [this.baseColoumns]
    });
    this.userData = JSON.parse(localStorage.getItem('currentUser')?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser'));
    this.userRole = this.userData.roleName.toLowerCase();
    this.cols = [
      { field: 'userMarketplaceName', header: 'Account Name' },
      { field: 'globalMarketplaceName', header: 'Channel' },
      { field: 'expiredOn', header: 'Expires On' },
      { field: 'isActive', header: 'Status' },
    ];
    this.getSalesChannels();
    this.getDisplacyColumns();
  }

  getDisplacyColumns() {
    if (this.permissionsHelper.viewOnly('Channel Configuration') && this.userData.roleId != 3) {
      this.displayedColumns = ['name', 'channel', 'status', 'expiredOn'];
    }
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

  //To get users
  getSalesChannels() {
    this.loading = true;
    this.marketplacesService.getUserMarketplaces(this.userData.companyId).subscribe(response => {
      if (response.body.data) {
        this.loading = false;
        this.salesChannels = response.body.data;
        this.dataSource = response.body.data;
        if (!this.keys) {
          this.keys = Object.keys(this.dataSource[0]);
          this.keys.sort();
          this.keys.map((res) => {
            this.rowData.push({ label: _.capitalize(res), value: res });
          });
        }
        this.permissionsHelper.notifyMarketplaceConfigured('notify');
      }
      else {
        this.loading = false;
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.loading=false;
      this.notificationService.Error('Something went wrong. Please try again later.');
    });
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

  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne.id === objTwo.id;
    }
  }

  showId(userMarketplaceId){
    this.deleteId = userMarketplaceId;
  }


  //To delete user marketplace
  deleteUserMarketplace(id) {
    this.marketplacesService.deleteUserMarketplace(id).subscribe(response => {
      this.loading=true;
      if (response != null) {
        this.loading=false;
        this.getSalesChannels();
        this.notificationService.Success(response.body.message);
      }
      else {
        this.loading=false;
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.loading=false;
      this.notificationService.Error(error.message);
    });
  }

  //Edit
  editSalesChannels(id) {
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  openDialog(id) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '600px',
      data: {
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Ok',
          cancel: 'Cancel'
        }
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        //Call delete
        this.deleteUserMarketplace(id)
      }
    });
  }

  getRefreshToken(id) {
    this.loading=true;
    this.marketplacesService.GeteBayOAuthRefreshToken(id).subscribe(response => {
      if (response != null && response.body.data.success) {
        this.loading=false;
        this.notificationService.Success("Token has been updated successfully.");
      }
      else {
        this.loading=false;
        this.notificationService.Error("Error in updating token, please try again later.");
      }
    }, error => {
      this.loading=false;
      this.notificationService.Error(error.message);
    });
  }
}

