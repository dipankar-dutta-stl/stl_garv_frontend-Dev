import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtTokenDecodeService } from '../jwt-token-decode.service';


@Injectable({
  providedIn: 'root'
})
export class RestrictguestAuthGuard implements CanActivate {

  role_token:any;

  constructor(private router: Router, private jwtDecode: JwtTokenDecodeService) { }

  canActivate() {

    const token = this.jwtDecode.tokenDecode(); 

    if(token){
      this.role_token= token.role;
    }

    if(this.role_token=='VLE' || this.role_token=='User' || this.role_token=='Doctor' || this.role_token=='Admin' && !this._tokenExpired(token.exp)) {
      return true;
    }

    this.router.navigate(['/login'])
    return false;
  }

  private _tokenExpired(expiration): boolean{
    return Math.floor(new Date().getTime()/1000)>= expiration;
  }
}
