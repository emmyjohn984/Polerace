import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { PermissionsHelper } from 'src/app/shared/helpers/permissions-helper';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
})
export class ManageUsersComponent implements OnInit {
  loading: boolean = true;
  users: Array<any> = [];
  cols: any;
  tableData: any;
  userId: any;
  constructor(
    private router: Router,
    private userService: UsersService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    public permissionsHelper: PermissionsHelper
  ) {}

  ngOnInit() {
    this.getUsers();
    this.getDisplacyColumns();
  }

  getDisplacyColumns() {
    if (this.permissionsHelper.viewOnly('Manage Users')) {
      this.cols = [
        'firstName',
        'lastName',
        'email',
        'roleName',
        'createdDate',
        'isActive',
      ];
    }
  }

  showDialog(data: any) {
    this.userId = data.userId;
  }

  //To get users.0
  total: any;
  getUsers() {
    let userData = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    // if (userData) {
    this.userService.getUsers(userData.companyId).subscribe(
      (response) => {
        if (response.body.data !== null) {
          this.users = response.body.data;
          this.tableData = this.users;
          this.total = this.users.length;
          this.loading = false;
        } else {
          console.log('this.message', response.body.message);
        }
      },
      (error) => {
        console.log('this.error', error);
      }
    );
    // }
  }

  //Edit
  editUser(userId) {
    this.router.navigate(['/manage-user/addUser'], {
      queryParams: { userId: userId },
    });
  }

  //Delete
  deleteUser(userId) {
    this.userService.deleteUser(userId).subscribe(
      (response) => {
        if (response.body.status == 200) {
          this.getUsers();
        } else {
          this.notificationService.Error(response.body.message);
        }
      },
      (error) => {
        console.log('this.error', error);
        this.notificationService.Error(error);
        0;
      }
    );
  }
}
