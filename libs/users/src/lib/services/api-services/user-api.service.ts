import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT, Environment } from '@stl-garv-frontend/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  getCaseDetailbyId(uid: any) {
      throw new Error('Method not implemented.');
  }

  constructor( private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) { }

  apiURLUser = this.env.apiURL + '/users';
  apiURLAdmin=this.env.apiURL+'/admin';

  register(userData: any) : Observable<any> {
    return this.http.post<any>(`${this.apiURLUser}/register`, userData);
  };

  registerintoUserDetail(userData: any) : Observable<any> {
    console.log(userData);
    return this.http.post<any>(`${this.apiURLUser}/add_usr_details`, userData)
  };

  resetPassword(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiURLUser}/resetPass`, userData);
  }

  getUserList(): Observable<any> {
    return this.http.get<any>(`${this.apiURLUser}/view_usr_details`)
  };

  getUserDetail(userDetailId: any): Observable<any> {
    return this.http.get<any>(`${this.apiURLUser}/view_usr_details/${userDetailId}`)
  };

  getUserDetailbyuid(userId: any): Observable<any> {
    return this.http.get<any>(`${this.apiURLUser}/view_user/${userId}`)
  };

  updateUser(userID:any, userData: any) : Observable<any> {
    return this.http.put<any>(`${this.apiURLUser}/edit_user/${userID}`, userData)
  };

  updateUserDetail(userDetailId:any, userDetail:any) : Observable<any> {
    return this.http.put<any>(`${this.apiURLUser}/edit_user`, userDetail)
  };

  updateUserPassword(userId:number, password:any): Observable<any> {
    return this.http.put<any>(`${this.apiURLUser}/update_user_pass/${userId}`, password)
  };

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURLUser}/delete_user/${userId}`)
  };

  getStates() {
    return this.http.get<any>(`${this.apiURLAdmin}/view_state`)
  };

  getStateDetailbyId(stateId: number): Observable<any> {
    return this.http.get<any>(`${this.apiURLAdmin}/view_state/${stateId}`)
  };

  createState(stateData:any): Observable<any> {
    
    return this.http.post(`${this.apiURLAdmin}/add_state`, stateData,{responseType:'text'})
  };

  updateState(stateData:any): Observable<any> {
    const headers=new HttpHeaders({'Authorization':"Bearer "+localStorage.getItem('Token')})
    return this.http.put(`${this.apiURLAdmin}/edit_state`, stateData,{headers:headers,responseType:'text'})
  };

  deleteState(stateId: number): Observable<any> {
    const headers=new HttpHeaders({'Authorization':"Bearer "+localStorage.getItem('Token')})
    return this.http.delete(`${this.apiURLAdmin}/delete_state/${stateId}`,{headers:headers,responseType:'text'})
  };

  getDistricts(): Observable<any> {
    return this.http.get<any>(`${this.apiURLAdmin}/view_district`)
  };

  getDistrictbyStateId(stateId: any): Observable<any> {
    const headers=new HttpHeaders({'Authorization':"Bearer "+localStorage.getItem('Token')})
    return this.http.get<any>(`${this.apiURLAdmin}/view_district_by_state/${stateId}`,{headers:headers})
  }

  getDstrictDetailbyId(distId: number): Observable<any> {
    const headers=new HttpHeaders({'Authorization':"Bearer "+localStorage.getItem('Token')})
    return this.http.get<any>(`${this.apiURLAdmin}/view_district/${distId}`,{headers:headers})
  };

  createDistrict(data: any): Observable<any>{
  const headers=new HttpHeaders({'Authorization':"Bearer "+localStorage.getItem('Token')})
  return this.http.post(`${this.apiURLAdmin}/add_district`, data,{headers:headers,responseType:'text'})
  };

  updateDistrict(distData:any): Observable<any> {
    const headers=new HttpHeaders({'Authorization':"Bearer "+localStorage.getItem('Token')})
    return this.http.put(`${this.apiURLAdmin}/edit_district`, distData,{headers:headers})
  };

  deleteDistrict(distId: number): Observable<any> {
    const headers=new HttpHeaders({'Authorization':"Bearer "+localStorage.getItem('Token')})
    return this.http.delete(`${this.apiURLAdmin}/delete_district/${distId}`,{headers:headers,responseType:'text'})
  };

  getTalukas(): Observable<any> {
    return this.http.get<any>(`${this.apiURLAdmin}/view_taluka`)
  };
 
  getTalukabyDistrictId(districtId: any): Observable<any> {
    const headers=new HttpHeaders({'Authorization':"Bearer "+localStorage.getItem('Token')})
    return this.http.get<any>(`${this.apiURLAdmin}/view_taluka_by_district/${districtId}`,{headers:headers})
  }

  getTalukaDetailbyId(talId: number): Observable<any> {
    const headers=new HttpHeaders({'Authorization':"Bearer "+localStorage.getItem('Token')})
    return this.http.get<any>(`${this.apiURLAdmin}/view_talukas/${talId}`,{headers:headers})
  };

  createTaluka(data: any): Observable<any>{
    const headers=new HttpHeaders({'Authorization':"Bearer "+localStorage.getItem('Token')})
    return this.http.post(`${this.apiURLAdmin}/add_talukas`, data,{headers:headers,responseType:'text'})
  };

  updateTaluka(talData:any): Observable<any> {
    const headers=new HttpHeaders({'Authorization':"Bearer "+localStorage.getItem('Token')})
    return this.http.put<any>(`${this.apiURLAdmin}/edit_talukas`, talData,{headers:headers})
  };

  deleteTaluka(talId: number): Observable<any> {
    const headers=new HttpHeaders({'Authorization':"Bearer "+localStorage.getItem('Token')})
    return this.http.delete(`${this.apiURLAdmin}/delete_talukas/${talId}`,{headers:headers,responseType:'text'})
  };

  getVillages(): Observable<any> {
    return this.http.get<any>(`${this.apiURLAdmin}/view_village`)
  };

  getVillagebyTalukaId(talukaId: any): Observable<any> {
    return this.http.get<any>(`${this.apiURLAdmin}/view_taluka_village/${talukaId}`)
  }

  getVillageDetailbyId(villageId: number): Observable<any> {
    const headers=new HttpHeaders({'Authorization':"Bearer "+localStorage.getItem('Token')})
    return this.http.get<any>(`${this.apiURLAdmin}/view_village/${villageId}`,{headers:headers})
  };
   
  createVillage(data: any): Observable<any>{
    const headers=new HttpHeaders({'Authorization':"Bearer "+localStorage.getItem('Token')})
    return this.http.post(`${this.apiURLAdmin}/add_village`, data,{headers:headers,responseType:'text'})
  };
  
  updateVillage(villageData:any): Observable<any> {
    const headers=new HttpHeaders({'Authorization':"Bearer "+localStorage.getItem('Token')})
    return this.http.put(`${this.apiURLAdmin}/edit_village`, villageData, {headers: headers, responseType:'text'})
  };

  deleteVillage(villageId: number): Observable<any> {
    const headers=new HttpHeaders({'Authorization':"Bearer "+localStorage.getItem('Token')})
    return this.http.delete(`${this.apiURLAdmin}/delete_village/${villageId}`,{headers:headers,responseType:'text'})
  };

  getPanchayat(): Observable<any> {
    return this.http.get<any>(`${this.apiURLAdmin}/view_grampanchayat`)
  };

  getPanchayatDetailbyId(panchayatId: number): Observable<any> {
    return this.http.get<any>(`${this.apiURLUser}/view_gp/${panchayatId}`)
  };
  
  getPanchayatbyVillageId(villageId: number): Observable<any> {
    return this.http.get<any>(`${this.apiURLUser}/view_village_gp/${villageId}`)
  };
  
  createPanchayat(data: any): Observable<any>{
    return this.http.post<any>(`${this.apiURLUser}/add_gp`, data)
  };

  updatePanchayat(panchayatData:any, panchayatId: number): Observable<any> {
    return this.http.put<any>(`${this.apiURLUser}/edit_gp/${panchayatId}`, panchayatData)
  };
  
  deletePanchayat(panchayatId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURLUser}/delete_gp/${panchayatId}`)
  };

  postImage(id:number, data: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('user_image', data)
    //console.log(formData)
    return this.http.post<any>(`${this.apiURLUser}/add_usr_image/${id}`, formData)
  }

  getAllModules(): Observable<any>{
    return this.http.get<any>(`${this.apiURLUser}/view_modules`)
  }

  createModule(formData: any): Observable<any>{
    return this.http.post<any>(`${this.apiURLUser}/add_module`, formData)
  }

  postModuleImg(id: number, data: File): Observable<any>{
    const formData: FormData = new FormData();
    formData.append('module_image', data)
    return this.http.post<any>(`${this.apiURLUser}/add_module_image/${id}`, formData)
  }

  getModulebyId(id: number): Observable<any> {
    const headers=new HttpHeaders({'Authorization':"Bearer "+localStorage.getItem('Token')})
    return this.http.get<any>(`${this.apiURLUser}/view_modules/${id}`,{headers:headers})
  }

  updateModule(moduleId: number, formData:any): Observable<any> {
    return this.http.put<any>(`${this.apiURLUser}/edit_module/${moduleId}`, formData)
  }

  deleteModule(id: number): Observable<any> {
    const headers=new HttpHeaders({'Authorization':"Bearer "+localStorage.getItem('Token')})
    return this.http.delete(`${this.apiURLUser}/delete_modules/${id}`,{headers:headers,responseType:'text'})
  }

  assignModuleToUser(id: number, data:any):Observable<any>{
    return this.http.post<any>(`${this.apiURLUser}/add_user_module/${id}`, data)
  }

  assignModuleToGP(id: number, data:any):Observable<any>{
    return this.http.post<any>(`${this.apiURLUser}/add_gp_module/${id}`, data)
  }

  getModulesbyUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiURLUser}/view_user_modules/${id}`)
  }

  getModulesbyGP(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiURLUser}/view_gram_modules/${id}`)
  }

  // analytic api

  updateModuleCount(formData: any): Observable<any> {
    return this.http.put<any>(`${this.apiURLUser}/gp_count`, formData)
  }

  getgpModuleCount(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiURLUser}/gp_get_count/${id}`)
  }

  getgpModuleCountByMonth(id:number, month:string, year: string): Observable<any> {
    return this.http.get<any>(`${this.apiURLUser}/gp_get_count_by_month/${id}/${month}/${year}`)
  }

  // analytics for kiosk 
   
  getKioskgp(): Observable<any> {
    return this.http.get<any>(`${this.apiURLUser}/kiosk_gp`)
  }

  getKioskbyId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiURLUser}/kiosk_gp/${id}`)
  }
   
  createKiosk(formData: any): Observable<any>{
    return this.http.post<any>(`${this.apiURLUser}/add_kiosk_gp`, formData)
  }

  updateKioskById(kioskId: number, formData:any): Observable<any> {
    return this.http.put<any>(`${this.apiURLUser}/edit_kiosk_gp/${kioskId}`, formData)
  }
  
  deleteKiosk(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURLUser}/delete_kiosk_gp/${id}`)
  }

  updateKioskCount(formData: any): Observable<any> {
    return this.http.put<any>(`${this.apiURLUser}/kiosk_count`, formData)
  }
  
  getKioskCountById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiURLUser}/kiosk_get_count/${id}`)
  }

  getkioskModuleCountByMonth(id:number, month:string, year: string): Observable<any> {
    return this.http.get<any>(`${this.apiURLUser}/kiosk_get_count_by_month/${id}/${month}/${year}`)
  }

  getkioskModuleCountByDay(id:number, day:string, month:string, year: string): Observable<any> {
    return this.http.get<any>(`${this.apiURLUser}/kiosk_get_count_by_day/${id}/${day}/${month}/${year}`)
  }

}