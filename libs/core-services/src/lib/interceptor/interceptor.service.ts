import { tap } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpInterceptor,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class SvInterceptorService implements HttpInterceptor {

  constructor() {}
  intercept(
    // tslint:disable-next-line:no-any
    req: HttpRequest<any>,
    next: HttpHandler
    // tslint:disable-next-line:no-any
  ): Observable<HttpEvent<any>> {
    if (req.body) {
      req.headers.append('Content-Type', 'application/json');
      req.headers.append('Cache-Control', 'no-cache');
      req.headers.append('Pragma', 'no-cache');
      req.headers.append('Content-Type', 'multipart/form-data');
    }
    // const token = this.cookie.check('token') ? this.cookie.get('token') : null;
    const token = localStorage.getItem('token') ? localStorage.getItem('token')?localStorage.getItem('token'):sessionStorage.getItem('token') : null;
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      });
    }

    return next.handle(req).pipe(
      tap(
        // tslint:disable-next-line:no-any
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        },
        // tslint:disable-next-line:no-any
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
          }
        }
      )
    );
  }
}
