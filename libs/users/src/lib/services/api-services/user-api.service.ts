import { HttpClient } from '@angular/common/http';
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
    return this.http.put<any>(`${this.apiURLUser}/edit_usr_details/${userDetailId}`, userDetail)
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
    
    return this.http.post<any>(`${this.apiURLAdmin}/add_state`, stateData)
  };

  updateState(stateData:any, stateId: number): Observable<any> {
    return this.http.put<any>(`${this.apiURLAdmin}/edit_state/${stateId}`, stateData)
  };

  deleteState(stateId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURLAdmin}/delete_state/${stateId}`)
  };

  getDistricts(): Observable<any> {
    return this.http.get<any>(`${this.apiURLAdmin}/view_district`)
  };

  getDistrictbyStateId(stateId: any): Observable<any> {
    return this.http.get<any>(`${this.apiURLAdmin}/view_state_district/${stateId}`)
  }

  getDstrictDetailbyId(distId: number): Observable<any> {
    return this.http.get<any>(`${this.apiURLAdmin}/view_district/${distId}`)
  };

  createDistrict(data: any): Observable<any>{
  return this.http.post<any>(`${this.apiURLAdmin}/add_district`, data)
  };

  updateDistrict(distData:any, distId: number): Observable<any> {
    return this.http.put<any>(`${this.apiURLAdmin}/edit_district/${distId}`, distData)
  };

  deleteDistrict(distId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURLAdmin}/delete_district/${distId}`)
  };

  getTalukas(): Observable<any> {
    return this.http.get<any>(`${this.apiURLAdmin}/view_taluka`)
  };
 
  getTalukabyDistrictId(districtId: any): Observable<any> {
    return this.http.get<any>(`${this.apiURLAdmin}/showTaluka/${districtId}`)
  }

  getTalukaDetailbyId(talId: number): Observable<any> {
    return this.http.get<any>(`${this.apiURLAdmin}/view_talukas/${talId}`)
  };

  createTaluka(data: any): Observable<any>{
    return this.http.post<any>(`${this.apiURLAdmin}/add_talukas`, data)
  };

  updateTaluka(talData:any, talId: number): Observable<any> {
    return this.http.put<any>(`${this.apiURLAdmin}/edit_talukas/${talId}`, talData)
  };

  deleteTaluka(talId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURLAdmin}/delete_talukas/${talId}`)
  };

  getVillages(): Observable<any> {
    return this.http.get<any>(`${this.apiURLAdmin}/view_village`)
  };

  getVillagebyTalukaId(talukaId: any): Observable<any> {
    return this.http.get<any>(`${this.apiURLAdmin}/view_taluka_village/${talukaId}`)
  }

  getVillageDetailbyId(villageId: number): Observable<any> {
    return this.http.get<any>(`${this.apiURLAdmin}/view_village/${villageId}`)
  };
   
  createVillage(data: any): Observable<any>{
    return this.http.post<any>(`${this.apiURLAdmin}/add_village`, data)
  };
  
  updateVillage(villageData:any, villageId: number): Observable<any> {
    return this.http.put<any>(`${this.apiURLAdmin}/edit_village/${villageId}`, villageData)
  };

  deleteVillage(villageId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURLAdmin}/delete_village/${villageId}`)
  };

  getPanchayat(): Observable<any> {
    return this.http.get<any>(`${this.apiURLAdmin}/view_gp`)
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
    return this.http.get<any>(`${this.apiURLUser}/view_module/${id}`)
  }

  updateModule(moduleId: number, formData:any): Observable<any> {
    return this.http.put<any>(`${this.apiURLUser}/edit_module/${moduleId}`, formData)
  }

  deleteModule(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURLUser}/delete_module/${id}`)
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