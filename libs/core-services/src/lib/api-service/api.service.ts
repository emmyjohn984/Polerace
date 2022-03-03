import { Injectable } from '@angular/core';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../src/environments/environment';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { ApiParams } from './view-models/api-params';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private errorhandler: ErrorHandlerService) { }
  // common get method for all http requests
  // tslint:disable-next-line
  getData(url: string, data: {} |null): Observable<any> {
    ; let headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Authorization', `Bearer ${this.getToken()}`);
    let newHTTPParams = new HttpParams();
    return this.http.get<any>(this.getUrl(url), { params: data, observe: 'response', headers })
      .pipe(catchError(this.handleError));
  }

  // common post method for all http requests
  // tslint:disable-next-line
  postData<T>(url: string, data: {}, reqAPIParams: ApiParams[]): Observable<any> {
    ; let headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', `Bearer ${this.getToken()}`);
    let newHTTPParams = new HttpParams();
    if (reqAPIParams != null) {
      reqAPIParams.forEach(element => {
        newHTTPParams = newHTTPParams.append(element.Key, element.Value);
      });
    }
    return this.http.post<T>(this.getUrl(url), data, { params: newHTTPParams, observe: 'response', headers })
      .pipe(catchError(this.handleError));
  }

  deleteData<T>(url: string, data: {}, reqAPIParams: ApiParams[]): Observable<any> {
    ; let headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', `Bearer ${this.getToken()}`);
    let newHTTPParams = new HttpParams();
    if (reqAPIParams != null) {
      reqAPIParams.forEach(element => {
        newHTTPParams = newHTTPParams.append(element.Key, element.Value);
      });
    }
    return this.http.delete<T>(this.getUrl(url), { params: newHTTPParams, observe: 'response', headers })
      .pipe(catchError(this.handleError));
  }

  RegisterUser<T>(url: string, data: {}, reqAPIParams: ApiParams[]): Observable<any> {
    ; let headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', 'true')
      // .set('Authorization', `Bearer ${this.getToken()}`);
    let newHTTPParams = new HttpParams();
    if (reqAPIParams != null) {
      reqAPIParams.forEach(element => {
        newHTTPParams = newHTTPParams.append(element.Key, element.Value);
      });
    }
    return this.http.post<T>(this.getUrl(url), data, { params: newHTTPParams, observe: 'response', headers })
      .pipe(catchError(this.handleError));
  }

  postExcelData<T>(url: string, data, reqAPIParams: ApiParams[]): Observable<any> {
    ; let headers = new HttpHeaders()
      //.set('content-type', 'multipart/form-data')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', `Bearer ${this.getToken()}`);
    let newHTTPParams = new HttpParams();
    if (reqAPIParams != null) {
      reqAPIParams.forEach(element => {
        newHTTPParams = newHTTPParams.append(element.Key, element.Value);
      });
    }
    return this.http.post<T>(this.getUrl(url), data, { params: newHTTPParams, observe: 'response', headers }).pipe(catchError(this.handleError));
  }

  // common error handling method
  public handleError = (error: Response) => {
    // Do messaging and error handling here
    //   this.errorhandler.handleError(error.status);
    return observableThrowError(error);
  };

  // attach base url
  private getUrl(url: string): string {
    return url;
  }

    getToken(): string {
      const token = localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token');
      return token;
    }
}
