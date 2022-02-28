import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { PermissionsHelper } from 'src/app/shared/helpers/permissions-helper';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AmazonListingService } from '../../services/amazon-listing.service';

@Component({
  selector: 'app-amazon-feeds-status',
  templateUrl: './amazon-feeds-status.component.html',
  styleUrls: ['./amazon-feeds-status.component.scss']
})

export class AmazonFeedsStatusComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['productId','sku','feedType', 'feedStatus', 'feedSubmissionId', 'requestId', 'statusCode', 'errorMessageType', 'errorDescription'];
  dataSource = new MatTableDataSource<any>();
  feedstatuses: Array<any> = [];
  currentUser: any = {};
  pageSize = 50;
  constructor(private router: Router, private notificationService: NotificationService, private dialog: MatDialog,
    private amazonListingService: AmazonListingService, public permissionsHelper: PermissionsHelper) {
    this.getDisplayColumns();
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getAmazonFeedsStatus();
  }

  getDisplayColumns() {
    if (this.permissionsHelper.viewOnly('Listing to Amazon')) {
      this.displayedColumns = ['productId','sku','feedType', 'feedStatus', 'feedSubmissionId', 'requestId', 'statusCode', 'errorMessageType', 'errorDescription'];
    }

  }

  //To get feeds status
  getAmazonFeedsStatus() {
    this.amazonListingService.getAmazonFeedsStatus(this.currentUser.companyId).subscribe(response => {
      if (response !== null && response.body.status == 200) {
        this.feedstatuses = response.body.data;
        this.dataSource.data = this.feedstatuses;
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error("Something went wrong. Please try again later");
    });
  }

  //Sync statuses
  syncFeedsStatus() {
    this.amazonListingService.getAmazonFeedSubmissionList().subscribe(response => {
      if (response !== null && response.body.status == 200) {
        this.getAmazonFeedsStatus();
      }
      else {
        this.notificationService.Error(response.body.message);
      }
    }, error => {
      this.notificationService.Error("Something went wrong. Please try again later");
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}