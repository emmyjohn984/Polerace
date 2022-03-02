import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';
import { MainComponent } from 'src/app/shared/layout/main/main.component';
import {AuthGuard} from 'src/app/auth/auth-gaurd'
import { from } from 'rxjs';
import { StaffDashboardComponent } from './components/staff-dashboard/staff-dashboard.component';


const routes: Routes =
  [
    {
      path: 'dashboard',
      loadChildren: () => import('../../Platform/dashboard/dashboard.module').then(m=> m.DashboardModule)
    },
    {
      path: '',
      component: MainComponent,
      canActivate: [AuthGuard],
      children:
        [
        
          {
            path: 'admindashboard', component: DashboardComponent, pathMatch: 'full',canActivate:[AuthGuard]
          },
          {
            path: 'staffdashboard', component: StaffDashboardComponent, pathMatch: 'full',canActivate:[AuthGuard]
          },
          {
            path: 'transaction',
            loadChildren: () => import('../../Platform/transaction/transaction.module').then(m => m.TransactionModule)
          },
          {
            path: 'shipping-package',
            loadChildren: () => import('../../Platform/shipping-package/shipping-package.module').then(m => m.ShippingPackageModule)
          },
          {
            path: 'inventory',
            loadChildren: () => import('../../Platform/inventory/inventory.module').then(m => m.InventoryModule)
          },
          {
            path: 'marketplaces',
            loadChildren: () => import('../../Platform/marketplaces/marketplaces.module').then(m => m.MarketplacesModule)
          },
          {
            path: 'customers',
            loadChildren: () => import('../../Platform/customers/customer.module').then(m => m.CustomersModule)
          },
          {
            path: 'orders',
            loadChildren: () => import('../../Platform/orders/orders.module').then(m => m.OrdersModule)
          },
          {
            path: 'reports',
            loadChildren: () => import('../../Platform/reports/reports.module').then(m => m.ReportsModule)
          },
          {
            path: 'settings',
            loadChildren: () => import('../../Platform/settings/settings.module').then(m => m.SettingsModule)
          },
          {
            path: 'sellers',
            loadChildren: () => import('../../Platform/sellers/sellers.module').then(m => m.SellersModule)
          },
          {
            path: 'users',
            loadChildren: () => import('../../Admin/user-management/user-management.module').then(m => m.UserManagementModule)
          },
          {
            path: 'subscription',
            loadChildren: () => import('../../Platform/subscription/subscription.module').then(m => m.SubscriptionModule)
          },
        ]
    }
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
