import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ENVIRONMENT, Environment } from '@stl-garv-frontend/environment';
import { Observable } from 'rxjs';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthService {

  constructor(
    private router:Router, 
    private http: HttpClient, 
    private storageService: StorageService, 
    @Inject(ENVIRONMENT) private env: Environment) { }

  apiURLUser = this.env.apiURL + '/users';

  login(unique_ID:string, password:string) {
    return this.http.post(`${this.apiURLUser}/login`, {unique_ID, password},{responseType:'text'});
  }

  logout(){
    this.storageService.removeItemfromLocal();
    this.storageService.removeItemfromSes();
    this.router.navigate(['/login'])
  }
}
