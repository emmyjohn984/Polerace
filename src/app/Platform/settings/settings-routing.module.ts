import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUsersComponent } from './components/add-users/add-users.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { CompanyProfileComponent } from './components/company-profile/company-profile.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { ManageGroupsComponent } from './components/manage-groups/manage-groups.component';
import { AuthGuard } from 'src/app/auth/auth-gaurd';
import { UpdateprofileComponent } from './components/updateprofile/updateprofile.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { UpdateSubscriptionComponent } from './components/update-subscription/update-subscription.component';
import { StripePaymentComponent } from './components/stripe-payment/stripe-payment.component';

const routes: Routes = [
        {
          path: 'myprofile',
          component:MyProfileComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'companyprofile',
          component: CompanyProfileComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'manageusers',
          component: ManageUsersComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'adduser',
          component: AddUsersComponent,
          canActivate: [AuthGuard]
        },
        {
          path:'managegroups',
          component:ManageGroupsComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'update-profile',
          component:UpdateprofileComponent,
          canActivate: [AuthGuard]
        },
        {
          path: "change-password",
          component: ChangepasswordComponent,
          canActivate:[AuthGuard]
        },
        {
          path: "update-subscription",
          component: UpdateSubscriptionComponent,
          canActivate: [AuthGuard]
        },
        {
          path:"payment",
          component:StripePaymentComponent,
          canActivate:[AuthGuard]
        }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
