import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service'
import { HomeComponent } from './Platform/home/components/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./Platform/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./Admin/user-management/user-management.module').then(m => m.UserManagementModule)
  },
  {
    path: 'visits',
    loadChildren: () => import('./Platform/visits/visits.module').then(m => m.VisitsModule)
  },
  {
    path: 'subscription',
    loadChildren: () => import('./Platform/subscription/subscription.module').then(m => m.SubscriptionModule)
  },
  {
    path: 'transaction',
    loadChildren: () => import('./Platform/transaction/transaction.module').then(m => m.TransactionModule)
  },
  {
    path: 'shipping-package',
    loadChildren: () => import('./Platform/shipping-package/shipping-package.module').then(m => m.ShippingPackageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./Platform/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./Platform/settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'sellers',
    loadChildren: () => import('./Platform/sellers/sellers.module').then(m => m.SellersModule)
  },
  {
    path: 'inventory',
    loadChildren: () => import('./Platform/inventory/inventory.module').then(m => m.InventoryModule)
  },
  {
    path: 'marketplaces',
    loadChildren: () => import('./Platform/marketplaces/marketplaces.module').then(m => m.MarketplacesModule)
  },
  {
    path: 'channels',
    loadChildren: () => import('./Platform/listing/listing.module').then(m => m.ListingModule)
  },
  {
    path: 'customers',
    loadChildren: () => import('./Platform/customers/customer.module').then(m => m.CustomersModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./Platform/orders/orders.module').then(m => m.OrdersModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./Platform/reports/reports.module').then(m => m.ReportsModule)
  },
  {
    path: '*', redirectTo: 'home'
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forRoot(routes, { useHash: false }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.validateAuthToken();
    if (currentUser) {
      // logged in so return true
      return true;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigateByUrl('/home');
    return false;
  }
}
