import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import register from '../models/register';
import forgotPassword from '../models/forgotPassword';
import resetPassword from '../models/resetPassword';
import { ApiService } from 'libs/core-services/src';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';


const jwtHelper = new JwtHelperService();


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private _coreService: ApiService) { }
  private verifyUserAndSendResetLinkURL ="Account/verifyUserAndSendResetLink/";

  login(userdata):Observable<any>{
  return this._coreService.postData(environment.apiUrl+'Account/Login', userdata,null);
  }
  register(register:register){
  return this._coreService.RegisterUser(environment.apiUrl+'authentication/register',register,null);
  }
  forgotPassword(formdata:forgotPassword){
  return this._coreService.postData(environment.apiUrl+'account/forgotPassword',formdata,null);
  }

  verifyUserAndSendResetLink(postData){
    return this._coreService.postData(environment.apiUrl+this.verifyUserAndSendResetLinkURL+postData, null, null);
  }
  resetPassword(formdata:resetPassword){
    return this._coreService.postData(environment.apiUrl+'authentication/ResetPassword',formdata,null);
  }
  verify(value){
  return this._coreService.postData(environment.apiUrl+'account/ConfirmEmail',value,null);
  }
  resendmail(Email)
  {
    let headers=new HttpHeaders();
      headers.append('Content-Type','application/json');
  return this._coreService.postData(environment.apiUrl+'account/ResendEmail?Email='+ Email,null,null);
  }
  logout(UserId){
    return this._coreService.getData(environment.apiUrl + 'Account/logout?UserId=' + UserId,null);
  }

  validateAuthToken():boolean{
    var token =this._coreService.getToken();
    if(token==null){
      return false;
    }
else{
  return !jwtHelper.isTokenExpired(token);
    }
  }

}
