import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Media } from '../models/media';
import { ENVIRONMENT, Environment } from '@stl-garv-frontend/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) { }

  apiURLEntertain = this.env.apiURLEntertain + '/entertain';

  getMediaContent(): Observable<Media[]> {
    return this.http.get<Media[]>(`${this.apiURLEntertain}/get_all_Media`) 
  }

  getMediaDetailByTitle(title: string): Observable<Media[]> {
    return this.http.get<Media[]>(`${this.apiURLEntertain}/getMediaDetails/${title}`)
  }

  filterMediaByCategory(filterData: any): Observable<any>{
    return this.http.post<any>(`${this.apiURLEntertain}/amarchitrakatha/getMedia`,filterData)
  }

  filterMediaByCategorySgc(filterData: any): Observable<any>{
    return this.http.post<any>(`${this.apiURLEntertain}/stlgarvcontent/getMedia`,filterData)
  }
  
}

