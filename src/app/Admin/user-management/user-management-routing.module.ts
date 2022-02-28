import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from 'src/app/shared/layout/main/main.component';
import { AddUserComponent } from './component/add-user/add-user.component';
import { ManageUserComponent } from './component/manage-user/manage-user.component';
import { AuthGuard } from 'src/app/auth/auth-gaurd';
import { SubscribedUsersComponent } from './component/subscribed-users/subscribed-users.component';
import { UpdateUserSubscriptionComponent } from './component/update-user-subscription/update-user-subscription.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children:[
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
    ]
  }
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
