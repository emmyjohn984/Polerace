import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService, ) { }

  Success(message?: string) {
    return this.toastr.success(message);
  }

  Error(message?: string) {
    return this.toastr.error(message);
  }

  Warning(message?: string) {
    return this.toastr.warning(message);
  }

  Info(message?: string) {
    return this.toastr.info(message);
  }
}


