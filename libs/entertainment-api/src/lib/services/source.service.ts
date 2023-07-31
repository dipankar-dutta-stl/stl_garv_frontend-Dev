import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@stl-garv-frontend/environment';
import { Observable } from 'rxjs';
import { Source } from '../models/source';

@Injectable({
  providedIn: 'root'
})
export class SourceService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) { }

  apiURLEntertain = this.env.apiURLEntertain + '/entertain';

  getAllSources():Observable<Source[]> {
       return this.http.get<Source[]>(`${this.apiURLEntertain}/get_all_sources`) 
  }

  createSource(formData: any):Observable<any> {
    return this.http.post<any>(`${this.apiURLEntertain}/add_new_source`, formData)
  }

  postSourceImage(id: number, data: File): Observable<any>{
    const formData: FormData = new FormData();
    formData.append('source_image', data)
    return this.http.post<any>(`${this.apiURLEntertain}/add_sourceImage/${id}`, formData)
  }

  getSourcebyId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiURLEntertain}/get_source_by_ID/${id}`)
  }

  updateSource(sourceId: number, formData:any): Observable<any> {
    return this.http.put<any>(`${this.apiURLEntertain}/update_source_details/${sourceId}`, formData)
  }

  deleteSourcebyId(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURLEntertain}/delete_source/${id}`)
  }

}
