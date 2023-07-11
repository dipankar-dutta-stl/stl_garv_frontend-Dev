import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private storageService: StorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    const token = this.storageService.getToken();
    //intercept the api url sent from frontend
    const isAPIUrl = request.url.startsWith("http://localhost:4200");

    if(token && isAPIUrl){
      request=request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    }
    return next.handle(request);
  }
}
