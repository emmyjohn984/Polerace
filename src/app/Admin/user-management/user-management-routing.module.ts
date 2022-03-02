import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUserComponent } from './component/add-user/add-user.component';
import { ManageUserComponent } from './component/manage-user/manage-user.component';
import { SubscribedUsersComponent } from './component/subscribed-users/subscribed-users.component';
import { UpdateUserSubscriptionComponent } from './component/update-user-subscription/update-user-subscription.component';

const routes: Routes = [
    {
      path: 'add-user',
      component:AddUserComponent
    },
    {
      path: 'manage-user',
      component:ManageUserComponent
    },
    {
      path: 'subscribed-users',
      component:SubscribedUsersComponent
    },
    {
      path: 'update-usersubscription',
      component: UpdateUserSubscriptionComponent
    }
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
