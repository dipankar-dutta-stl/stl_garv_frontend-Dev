import { Injectable } from '@angular/core';
import { CanActivate, Router, } from '@angular/router';
import { JwtTokenDecodeService } from '../jwt-token-decode.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(private router: Router, private jwtDecode: JwtTokenDecodeService) { }

  canActivate() {

    const token = this.jwtDecode.tokenDecode();

    if(token && token.role=='Admin' && !this._tokenExpired(token.exp)){
      return true;
    }
    
    this.router.navigate(['/login'])
    return false;
  }

  private _tokenExpired(expiration): boolean{
    return Math.floor(new Date().getTime()/1000)>= expiration;
  }
}
