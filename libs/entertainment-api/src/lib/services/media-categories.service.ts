import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mediaCategory } from '../models/media-category';
import { Observable } from 'rxjs';
import { ENVIRONMENT, Environment } from '@stl-garv-frontend/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaCategoriesService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) { }

  apiURLEntertain = this.env.apiURL + 'entertain/';

  getCategories(): Observable<mediaCategory[]> {
    return this.http.get<mediaCategory[]>(this.apiURLEntertain + 'getCategory')
  }
}
