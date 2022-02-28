import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class PermissionsHelper {
    private currentUserData: any = {};
    private currentUserGroups: any = [];
    loading:boolean = false;
    private notify = new BehaviorSubject<any>('');
    notifyChannelsObservable = this.notify.asObservable();

    constructor() {
        this.currentUserData = {};
        this.currentUserGroups = {};
        this.currentUserData = localStorage.getItem("currentUser")?localStorage.getItem('currentUser'):sessionStorage.getItem('currentUser');
        if (this.currentUserData !== null) {
            this.currentUserData = JSON.parse(this.currentUserData);
            this.currentUserGroups = this.currentUserData.groups;
        }

    }

    getRole() {
        return this.currentUserData.roleName;
    }

    getModulePermissions(moduleName: string) {
        let hasPermission: boolean = false;
        this.currentUserGroups.forEach(item => {
            if (item.moduleName.toLowerCase() == moduleName.toLowerCase() && (item.delete || item.isEdit || item.view)) {
                hasPermission = true;
            }
        });
        return hasPermission;
    }

    isEditable(moduleName: string) {
        let hasPermission: boolean = false;
        let module = this.currentUserGroups.filter(c => c.moduleName.toLowerCase() == moduleName.toLowerCase() && c.isEdit == true);
        if (module.length > 0) {
            hasPermission = module[0].isEdit;
        }
        return hasPermission;
    }

    isDelete(moduleName: string) {
        let hasPermission: boolean = false;
        let module = this.currentUserGroups.filter(c => c.moduleName.toLowerCase() == moduleName.toLowerCase() && c.delete == true);
        if (module.length > 0) {
            hasPermission = module[0].delete;
        }
        return hasPermission;
    }

    viewOnly(moduleName: string) {
        let hasPermission: boolean = false;
        let module = this.currentUserGroups.filter(c => c.moduleName.toLowerCase() == moduleName.toLowerCase() && c.view == true && c.delete == false && c.isEdit == false);
        if (module.length > 0) {
            hasPermission = module[0].view;
        }
        return hasPermission;
    }

    checkLandingPage(moduleName: string) {
      this.loading=true;
        let hasPermission: boolean = false;
        let module = this.currentUserGroups.filter(c => c.moduleName.toLowerCase() == moduleName.toLowerCase() && (c.delete == true || c.isEdit == true || c.view == true))
        if (module.length > 0 || this.currentUserData.roleName.toLowerCase() == "super admin" || this.currentUserData.roleName.toLowerCase() == "admin") {
            hasPermission = true;
            this.loading = false;
        }
        return hasPermission;
    }

    public notifyMarketplaceConfigured(data) {
        if (data) {
          this.notify.next(data);
        }
      }
}
