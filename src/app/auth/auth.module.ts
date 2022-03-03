import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { CoreServicesModule } from 'libs/core-services/src';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [],
  imports: [
    AuthRoutingModule,
    CoreServicesModule,
    SharedModule
  ],

  providers: [],
  exports: []
})
export class AuthModule { }
