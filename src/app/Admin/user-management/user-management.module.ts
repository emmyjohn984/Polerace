import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { AddUserComponent } from './component/add-user/add-user.component';
import { ManageUserComponent } from './component/manage-user/manage-user.component';
import { SubscribedUsersComponent } from './component/subscribed-users/subscribed-users.component';
import { UpdateUserSubscriptionComponent } from './component/update-user-subscription/update-user-subscription.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AddUserComponent, ManageUserComponent, SubscribedUsersComponent, UpdateUserSubscriptionComponent],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    SharedModule
  ]
})
export class UserManagementModule { }
