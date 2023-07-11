import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtTokenDecodeService } from '../jwt-token-decode.service';
import { StorageService } from '../storage.service';


@Injectable({
  providedIn: 'root'
})
export class DefaultAuthGuard implements CanActivate {

  role_token:any;

  constructor(private router: Router, private storageService: StorageService, private jwtDecode: JwtTokenDecodeService) { }

  canActivate() {

    const token = this.jwtDecode.tokenDecode();

    if(token){
      this.role_token= token.role;
    }
    const role = this.storageService.getRolefromSes();

    if(role=='guest' || this.role_token=='VLE' || this.role_token=='User' || this.role_token=='Doctor' && !this._tokenExpired(token.exp)) {
      return true;
    }

    else if(this.role_token=='Admin'){
      this.router.navigate(['/admin/metadata'])
      return true;
      
    }

    this.router.navigate(['/login'])
    return false;
  }

  private _tokenExpired(expiration): boolean{
    return Math.floor(new Date().getTime()/1000)>= expiration;
  }
}
