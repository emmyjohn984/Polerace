import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service'

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./Platform/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },

  // {
  //   path: 'visits',
  //   loadChildren: () => import('./Platform/visits/visits.module').then(m => m.VisitsModule)
  // },

  // {
  //   path: 'channels',
  //   loadChildren: () => import('./Platform/listing/listing.module').then(m => m.ListingModule)
  // },
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
