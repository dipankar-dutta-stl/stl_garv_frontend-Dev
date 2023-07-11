import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  //constructor() {}

  setItem(data:any) {
    if (data=='guest'){
      sessionStorage.setItem('Role', data);
    }
    else{
      localStorage.setItem('Token', data);
    }
  }

  getToken() : string {
    return localStorage.getItem('Token')
  }

  getRolefromSes() : string {
    return sessionStorage.getItem('Role');
  }

  removeItemfromSes() {
     sessionStorage.removeItem('Role');
  }

  removeItemfromLocal() {
    localStorage.removeItem('Token');
    localStorage.removeItem('Role');
 }
}
