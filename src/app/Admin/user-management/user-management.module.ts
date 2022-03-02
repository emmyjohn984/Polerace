import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { AddUserComponent } from './component/add-user/add-user.component';
import { ManageUserComponent } from './component/manage-user/manage-user.component';
import { InputSwitchModule, TableModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubscribedUsersComponent } from './component/subscribed-users/subscribed-users.component';
import { UpdateUserSubscriptionComponent } from './component/update-user-subscription/update-user-subscription.component';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { Tooltip, TooltipModule } from 'primeng';

@NgModule({
  declarations: [AddUserComponent, ManageUserComponent, SubscribedUsersComponent, UpdateUserSubscriptionComponent],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    InputSwitchModule,
    TableModule,
    MatSelectModule,
    MatListModule,
    TooltipModule
  ]
})
export class UserManagementModule { }
