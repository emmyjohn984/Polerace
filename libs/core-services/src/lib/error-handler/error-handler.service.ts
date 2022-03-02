import { ErrorHandler, Injectable } from '@angular/core';
import { StatusMessage, StatusCode } from '../config/constants';
import { NotificationService } from '../notification-service/notification.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {
  constructor(
    private notificationservice: NotificationService,
    private router: Router
  ) {}

  handleError(error) {
    switch (error) {
      case StatusCode.Unauthorized: {
        localStorage.clear();
        this.router.navigate(['/']);

        break;
      }
      case StatusCode.BadRequest: {
        this.notificationservice.Warning( StatusMessage.BadRequest);
        break;
      }
      case StatusCode.Forbidden: {
        this.notificationservice.Warning(
          StatusMessage.Forbidden
        );
        this.removeCredentials();
        break;
      }
      case StatusCode.InternalServerError: {
        console.log(error);
        break;
      }
      case StatusCode.NotFound: {
        this.notificationservice.Warning(StatusMessage.NotFound);
        break;
      }
      default: {
      }
    }
  }

  removeCredentials() {
    localStorage.clear();
  }
}
