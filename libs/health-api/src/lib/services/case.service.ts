import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT, Environment } from '@stl-garv-frontend/environment';

@Injectable({
  providedIn: 'root'
})
export class CaseService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) { }

  apiURLCase = this.env.apiURL + 'health';


  getCaseList(): Observable<any> {
    return this.http.get<any>(`${this.apiURLCase}/view_cases`)
  };

  getCaseDetailbyId(caseId: any): Observable<any> {
    return this.http.get<any>(`${this.apiURLCase}/view_cases/${caseId}`)
  };

  getCaseByUserId(userId: any): Observable<any> {
    return this.http.get<any>(`${this.apiURLCase}/view_cases_by_user/${userId}`)
  }

  getCasesByVle(): Observable<any> {
    return this.http.get<any>(`${this.apiURLCase}/view_cases_by_vle`)
  }
  getCasesByDoctor(): Observable<any> {
    return this.http.get<any>(`${this.apiURLCase}/view_cases_by_doctor`)
  }

  createCase(caseData: any) : Observable<any> {
    return this.http.post<any>(`${this.apiURLCase}/add_cases`, caseData);
  };

  updateCase(caseID:any, caseData: any) : Observable<any> {
    return this.http.put<any>(`${this.apiURLCase}/edit_cases/${caseID}`, caseData)
  };

  deleteCase(caseId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURLCase}/delete_cases/${caseId}`)
  }

  getDoctorMap() : Observable<any> {
    return this.http.get<any>(`${this.apiURLCase}/view_doctormap`);
  };
  
  createDoctorMap(caseData: any) : Observable<any> {
    return this.http.post<any>(`${this.apiURLCase}/add_doctormap`, caseData);
  };

  updateDoctorMap(id:any, caseData: any) : Observable<any> {
    return this.http.put<any>(`${this.apiURLCase}/edit_doctormap/${id}`, caseData)
  };

  deleteDoctorMap(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURLCase}/delete_doctormap/${id}`)
  }
  createHealthData(caseData: any) : Observable<any> {
    return this.http.post<any>(`${this.apiURLCase}/add_health_data`, caseData);
  };

  updateHealthData(id:any, caseData: any) : Observable<any> {
    return this.http.put<any>(`${this.apiURLCase}/edit_health_data/${id}`, caseData)
  };

  deleteHealthData(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURLCase}/delete_health_data/${id}`)
  }

  createPrescription(caseData: any) : Observable<any> {
    return this.http.post<any>(`${this.apiURLCase}/add_prescription`, caseData);
  };

  updatePrescription(id:any, caseData: any) : Observable<any> {
    return this.http.put<any>(`${this.apiURLCase}/edit_prescription/${id}`, caseData)
  };

  deletePrescription(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURLCase}/delete_prescription/${id}`)
  }

  postPrescriptionImage(id:number, data: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('prescription_image', data)
    //console.log(formData)
    return this.http.post<any>(`${this.apiURLCase}/upload_prescription/${id}`, formData)
  }

  getVleDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiURLCase}/view_vle_dash`)
  }
}
