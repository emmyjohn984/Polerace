import { identifierModuleUrl } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { ApiService } from 'libs/core-services/src';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  private getRolesURL = "Account/GetRoles";
  private RolesByCompanyIdURL = "Account/GetRolesByCompanyid/";
  private createUpdateUserURL = "Account/CreateUpdateUser";
  private getUserByUserIdURL = "Account/GetUserByUserId";
  private getUsersURL = "Account/GetUsers";
  private deleteUserURL = "Account/DeleteUser";
  private getGroupsURL = "Account/GetGroups";
  private getGroupsByCompanyIdUrl ="Account/GetGroupsByCompanyId/"
  private getCountriesURL = "Account/GetCountries";
  private getStatesURL = "Account/GetStates";
  private updatePasswordUrl="Account/UpdatePassword";
  private uploadProfilePhotoURL="Account/UploadProfilePhoto";
  private createRoleUrl="Account/createupdateRole";
  private createGroupUrl="Account/createUpdateGroup";
  private GetGroupsByRoleIdURL ="Account/GetGroupsByRoleId/"
  private GetModulePermissionsURL ="Account/GetModulePermissions/"
  private CreateUpdateModulePermissionUrl = "Account/createUpdateModulePermissions";
  private updatePermissionsUrl = "Account/updatePermissions";
  private updateCompany = "Account/UpdateCompany";
  private company1 = "Account/GetSellersByCompanyId";
  private getAllUsers = "Account/GetUsers";
  private subscribedUsersUrl = "Authentication/GetUserSubscription";
  private getSubscribedUsersUrl = "Authentication/UserSubscription/";
  private getSubscriptionById = "Authentication/GetSubscriptionPlan/";
  private getAllSubscriptionsUrl = "Authentication/GetSubscriptionPlans";
  private updateUserSubscriptionUrl = "Authentication/UpdateUserSubscription";
  private payment = 'Authentication/UpdateUserSubscription';

  constructor(private coreService: ApiService) {
  }

  //To get roles
  getRoles() {
    return this.coreService.getData(environment.apiUrl+this.getRolesURL, null);
  }

  //To get roles
  getRolesByCompanyId(companyId) {
    return this.coreService.getData(environment.apiUrl+this.RolesByCompanyIdURL+companyId, null);
  }

   //To get groups
   getGroupsByRoleId(roleId) {
    return this.coreService.getData(environment.apiUrl+this.GetGroupsByRoleIdURL + roleId, null);
  }

   //To get get permissions for modules
   getModulePermissions(roleId,groupId) {
    return this.coreService.getData(environment.apiUrl+this.GetModulePermissionsURL + roleId+'/'+groupId, null);
  }
  //To create or update user
  createUpdateUser(postData) {
    return this.coreService.postData(environment.apiUrl+this.createUpdateUserURL, postData, null);
  }

   //To create or update Module Permissions
   createUpdatModulePermissions(postData) {
    return this.coreService.postData(environment.apiUrl+this.CreateUpdateModulePermissionUrl, postData, null);
  }

  //To create or update Module Permissions
  UpdateModulePermissions(postData) {
    return this.coreService.postData(environment.apiUrl+this.updatePermissionsUrl, postData, null);
  }
 //To create or update user
  CreateRole(postData) {
    return this.coreService.postData(environment.apiUrl+this.createRoleUrl, postData, null);
  }

   //To create or update user
   createGroup(postData) {
    return this.coreService.postData(environment.apiUrl+this.createGroupUrl, postData, null);
  }

   //To create or update Password
   updatePassword(postData) {
    return this.coreService.postData(environment.apiUrl+this.updatePasswordUrl, postData, null);
  }
  //To get user by user id
  getUserByUserId(userId: number) {
    return this.coreService.getData(environment.apiUrl+this.getUserByUserIdURL + "/" + userId, null);
  }

  //To get user by company id
  getUsers(companyId: number) {
    return this.coreService.getData(environment.apiUrl+this.getUsersURL + "/" + companyId, null);
  }

  //To get all user
  getUser(){
    return this.coreService.getData(environment.apiUrl+this.getAllUsers,null)
  }

  //To delete user by user id
  deleteUser(userId: number) {
    return this.coreService.postData(environment.apiUrl+this.deleteUserURL + "/" + userId, null, null);
  }

  //To get user by company id
  getGroups() {
    return this.coreService.getData(environment.apiUrl+this.getGroupsURL, null);
  }

  //To get user by company id
  getGroupsByCompanyId(companyId) {
    return this.coreService.getData(environment.apiUrl+this.getGroupsByCompanyIdUrl+companyId, null);
  }
  //To get countries
  getCountries() {
    return this.coreService.getData(environment.apiUrl+this.getCountriesURL, null);
  }

  //To get states by country id
  getStates(countryId: number) {
    return this.coreService.getData(environment.apiUrl+this.getStatesURL + "/" + countryId, null);
  }

  //To create or update Password
  uploadProfilePhoto(postData) {
    return this.coreService.postData(environment.apiUrl+this.uploadProfilePhotoURL, postData, null);
  }

  getCompanyData(id){
    return this.coreService.getData(environment.apiUrl +this.company1+ "/"+id,null, )
  }

  updateCompanies(params) {
    return this.coreService.postData(environment.apiUrl+this.updateCompany,params,null)
  }

  // To get ll subcribed users
  subscribedUsers(){
    return this.coreService.getData(environment.apiUrl+this.subscribedUsersUrl,null)
  }

  // To get subscribed user by userid
  getSubscriptionByUser(id){
    return this.coreService.getData(environment.apiUrl+this.getSubscribedUsersUrl+id,null)
  }

  // To get subscription by subscription id
  getSubscriptionBySubscriptionId(id){
    return this.coreService.getData(environment.apiUrl+this.getSubscriptionById+id,null)
  }

  // To get All Subscriptions
  getAllSubscriptions(){
    return this.coreService.getData(environment.apiUrl+this.getAllSubscriptionsUrl,null)
  }

  // To update subscription by userId and SubscriptionId
  updateUserSubscription(params){
    return this.coreService.postData(environment.apiUrl+this.updateUserSubscriptionUrl,params,null)
  }

  //Payment for update subscription 
  stripePayment(payload){
    return this.coreService.postData(environment.apiUrl+this.payment,payload,null);
  }

}
