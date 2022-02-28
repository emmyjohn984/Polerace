import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { NotificationService } from 'libs/core-services/src/lib/notification-service/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error } from 'protractor';
import { ITS_JUST_ANGULAR } from '@angular/core/src/r3_symbols';
import { PermissionsHelper } from 'src/app/shared/helpers/permissions-helper';

@Component({
  selector: 'app-manage-groups',
  templateUrl: './manage-groups.component.html',
  styleUrls: ['./manage-groups.component.scss'],
})
export class ManageGroupsComponent implements AfterViewInit {
  // @ViewChild(MatPaginator) rolepaginator: MatPaginator;
  //  @ViewChild(MatSort) rolesort: MatSort;
  // @ViewChild(MatPaginator) grppaginator: MatPaginator;
  // @ViewChild(MatSort) grpsort: MatSort;
  @ViewChild('rolesort') rolesort: MatSort;
  @ViewChild('grpsort') grpsort: MatSort;
  @ViewChild('permissionsort') permissionsort: MatSort;
  //@ViewChild(MatPaginator) permissionspaginator: MatPaginator;
  //  @ViewChild(MatSort) permissionsort: MatSort;
  @ViewChild('rolepaginator', { read: MatPaginator })
  rolepaginator: MatPaginator;
  @ViewChild('grppaginator', { read: MatPaginator }) grppaginator: MatPaginator;
  @ViewChild('permissionspaginator', { read: MatPaginator })
  permissionspaginator: MatPaginator;
  addRoleForm: FormGroup;
  roleSubmitted: boolean = false;
  groupSubmitted: boolean = false;
  submitted: boolean = false;
  addGroupForm: FormGroup;
  roles: any = [];
  groups: any = [];
  roleId: any;
  groupId: any;
  permissionsList: any = [];
  roleBtnText: string = 'Add Role';
  groupBtnText: string = 'Add Group';
  companyId: number = 0;
  groupssrc: any = [];
  displayedColumns: string[] = [
    'moduleName',
    'edit',
    'delete',
    'view',
    'isActive',
  ];
  displayedColumns1: string[] = ['roleName', 'isActive', 'actions'];
  displayedColumnsgroups: string[] = [
    'RoleName',
    'groupName',
    'isActive',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>();
  roledataSource = new MatTableDataSource<any>();
  groupDataSource = new MatTableDataSource<any>();
  userRole: string;
  users: Array<any> = [];
  constructor(
    private router: Router,
    private userService: UsersService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    public permissionsHelper: PermissionsHelper
  ) {
    var userdata = JSON.parse(
      localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : sessionStorage.getItem('currentUser')
    );
    this.companyId = userdata.companyId;
    this.userRole = userdata.roleName.toLowerCase();
  }

  ngOnInit() {
    this.initializeAddRoleForm();
    this.getRoles();
    this.roleBtnText = 'Add Role';
    this.groupBtnText = 'Add Group';
    this.getGroupsSrc();
    setTimeout(() => {
      this.dataSource.sort = this.permissionsort;
      this.dataSource.paginator = this.permissionspaginator;
      this.roledataSource.sort = this.rolesort;
      this.roledataSource.paginator = this.rolepaginator;
      this.groupDataSource.sort = this.grpsort;
      this.groupDataSource.paginator = this.grppaginator;
    });
  }

  //Get from controls
  get formControls() {
    return this.addRoleForm.controls;
  }

  get formControls2() {
    return this.addGroupForm.controls;
  }

  getGroupsSrc() {
    this.userService.getGroupsByCompanyId(this.companyId).subscribe(
      (response) => {
        if (response.body.status == 200) {
          this.groupssrc = response.body.data;

          this.groupDataSource.data = this.groupssrc;
          setTimeout(() => {
            this.groupDataSource.sort = this.grpsort;
            this.groupDataSource.paginator = this.grppaginator;
          });
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  initializeAddRoleForm() {
    this.addRoleForm = this.formBuilder.group({
      roleId: [0],
      roleName: ['', [Validators.required]],
      isActive: [true, Validators.required],
    });

    this.addGroupForm = this.formBuilder.group({
      groupId: [0],
      groupName: ['', [Validators.required]],
      isActive: [true, Validators.required],
      roleId: ['', [Validators.required]],
    });
  }

  //To get users
  getRoles() {
    this.userService.getRolesByCompanyId(this.companyId).subscribe(
      (response) => {
        if (response.body.data !== null) {
          this.roles = response.body.data;
          this.roledataSource.data = this.roles;
          setTimeout(() => {
            this.roledataSource.sort = this.rolesort;
            this.roledataSource.paginator = this.rolepaginator;
          });
        } else {
          console.log('this.message', response.body.message);
        }
      },
      (error) => {
        console.log('this.error', error);
      }
    );
  }

  onAddRoleSubmit(e) {
    if (!this.addRoleForm.invalid) {
      this.roleSubmitted = true;
      let postData = this.addRoleForm.value;
      postData.companyId = this.companyId;
      if (postData.roleId == null) {
        postData.roleId = 0;
      }
      //   postData.companyId = this.addRoleForm.companyId;
      postData.IsUserModified = true;
      this.userService.CreateRole(postData).subscribe(
        (response) => {
          if (response.body.status === 200) {
            if (response.body.data != null) {
              this.getRoles();
            } else this.getRoles();
            this.addRoleForm.reset();
            let defaultRoleFormVal = {
              roleId: 0,
              roleName: '',
              isActive: true,
            };
            this.addRoleForm.patchValue(defaultRoleFormVal);
            this.roleBtnText = 'Add Role';
            this.roleSubmitted = false;
            this.notificationService.Success(response.body.message);
          } else {
            this.notificationService.Error(response.body.message);
            this.roleSubmitted = false;
          }
        },
        (error) => {
          console.log('this.error', error);
          this.notificationService.Error(error);
          this.roleSubmitted = false;
        }
      );
    }
  }

  //To submit
  onGroupAdd(e) {
    if (!this.addGroupForm.invalid) {
      this.groupSubmitted = true;
      let postData = this.addGroupForm.value;
      postData.companyId = this.companyId;
      //   postData.companyId = this.addRoleForm.companyId;
      postData.IsUserModified = true;
      this.userService.createGroup(postData).subscribe(
        (response) => {
          if (response.body.status === 200) {
            this.notificationService.Success(response.body.message);
          } else {
            this.notificationService.Error(response.body.message);
          }
          this.addGroupForm.reset();
          let defaultGroupVal = {
            roleId: 0,
            groupName: '',
            isActive: true,
            groupId: 0,
          };
          this.addGroupForm.patchValue(defaultGroupVal);
          this.groupBtnText = 'Add Group';
          this.groupSubmitted = false;
          this.getGroupsSrc();
        },
        (error) => {
          console.log('this.error', error);
          this.notificationService.Error(error);
          this.groupSubmitted = false;
        }
      );
    }
  }

  getGroupsByRole(roleId) {
    this.userService.getGroupsByRoleId(roleId).subscribe(
      (response) => {
        if (response.body.status == 200) {
          this.groups = response.body.data;
        } else {
          console.log(response.body.message);
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  EditRole(roleId) {
    if (roleId == undefined) {
      this.notificationService.Warning('Please select a role to edit.');
      return;
    } else {
      var roleselected = this.roles.filter((obj) => {
        if (obj.roleId == roleId) {
          return obj;
        }
      });
      this.addRoleForm.patchValue(roleselected[0]);
      this.roleBtnText = 'Update Role';
    }
  }

  updatePermissions() {
    this.userService.UpdateModulePermissions(this.permissionsList).subscribe(
      (response) => {
        if (response.body.status == 200) {
          this.notificationService.Success(response.body.message);
          this.getPermissions();
        } else {
          this.notificationService.Success(response.body.message);
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  editGroup(group) {
    if (group == undefined) {
      this.notificationService.Warning('Please select a group to edit.');
      return;
    } else {
      let groupSelected = {
        roleId: group.roleId,
        groupName: group.groupName,
        isActive: group.isActive,
        groupId: group.groupId,
      };
      this.addGroupForm.patchValue(groupSelected);
      this.groupBtnText = 'Update Group';
    }
  }

  getPermissions() {
    if (this.roleId == undefined || this.groupId == undefined) {
      this.notificationService.Error(
        'Please select a role and a  group to get permissions.'
      );
      return;
    }
    this.userService.getModulePermissions(this.roleId, this.groupId).subscribe(
      (response) => {
        if (response.body.status == 200) {
          this.permissionsList = response.body.data;
          this.dataSource.data = this.permissionsList;
          setTimeout(() => {
            this.dataSource.sort = this.permissionsort;
            this.dataSource.paginator = this.permissionspaginator;
          });
        } else {
          console.log(response.body.message);
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  //Edit
  Updaterow(modulePermission) {
    this.userService.createUpdatModulePermissions(modulePermission).subscribe(
      (response) => {
        if (response.body.status == 200) {
          this.notificationService.Success(response.body.message);
        } else {
          this.notificationService.Success(response.body.message);
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.permissionsort;
    this.dataSource.paginator = this.permissionspaginator;
    this.roledataSource.sort = this.rolesort;
    this.roledataSource.paginator = this.rolepaginator;
    this.groupDataSource.sort = this.grpsort;
    this.groupDataSource.paginator = this.grppaginator;
  }

  openDialog(roleId) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '600px',
      data: {
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Ok',
          cancel: 'Cancel',
        },
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
      }
    });
  }
}
