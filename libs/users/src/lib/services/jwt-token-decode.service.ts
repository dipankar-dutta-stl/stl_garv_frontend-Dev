//----This Service is for decoding the jwt token received on login----//

import { Injectable } from '@angular/core';
import { LoginAuthService } from './api-services/login-auth.service';
import { UserApiService } from './api-services/user-api.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenDecodeService {

  constructor(private storageService: StorageService, private userService: LoginAuthService) { }

  tokenDecode(){
    const token = this.storageService.getToken();

    if(token) {
      const splitToken = JSON.parse(atob(token.split('.')[1]));

      if(splitToken && !this._tokenExpired(splitToken.exp)){
        return splitToken;
      }

      else{
        this.userService.logout();
      }
    }
  }

  private _tokenExpired(expiration): boolean{
    return Math.floor(new Date().getTime()/1000)>= expiration;
  }
}
