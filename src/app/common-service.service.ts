import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {
  data: any='';
    constructor(private http: HttpClient) { }

  private items: BehaviorSubject<any> = new BehaviorSubject<any>(this.data);
  items$: Observable<any> = this.items.asObservable();
  setLocalStorageData(currentUser) {// Call this function to set localstorage
    localStorage.setItem("currentUser",  JSON.stringify(currentUser))
    this.data = currentUser;
  }  
}
