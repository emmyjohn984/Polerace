import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './api-service/api.service';
export { ApiService } from './api-service/api.service';
import { NotificationService } from './notification-service/notification.service';
import { GlobalSharedService } from './global-shared-service/global-shared.service';
import {ToastrModule} from 'ngx-toastr';
export {GlobalSharedService} from './global-shared-service/global-shared.service';

@NgModule({
  imports: [CommonModule],
  providers: [ApiService, NotificationService, GlobalSharedService,ToastrModule],
  exports: []
})
export class CoreServicesModule {}
