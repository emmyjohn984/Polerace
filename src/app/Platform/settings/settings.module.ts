import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { AddUsersComponent } from './components/add-users/add-users.component';
import { CompanyProfileComponent } from './components/company-profile/company-profile.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import {ManageGroupsComponent} from './components/manage-groups/manage-groups.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { UpdateprofileComponent } from './components/updateprofile/updateprofile.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { UpdateSubscriptionComponent } from './components/update-subscription/update-subscription.component';
import { StripePaymentComponent } from './components/stripe-payment/stripe-payment.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MyProfileComponent, AddUsersComponent, CompanyProfileComponent, ManageUsersComponent,ManageGroupsComponent, ChangepasswordComponent, UpdateprofileComponent, HeaderComponent, FooterComponent, UpdateSubscriptionComponent, StripePaymentComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
  ]
})
export class SettingsModule { }
