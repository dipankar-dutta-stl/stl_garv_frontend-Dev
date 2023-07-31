import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { Manufacturer } from '../models/manufacturer';
import { ProductCategory } from '../models/product-category';
import { ENVIRONMENT, Environment } from '@stl-garv-frontend/environment';

@Injectable({
  providedIn: 'root'
})
export class PortalApiService {

  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: Environment) { }

  apiURLPortal = this.env.apiURL_Ecomm;// + 'ecomm';
  
  getAllProduct(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiURLPortal}/view_products`);
  }

  getProductDetailsById(id: number): Observable<Product>{
    
    return this.http.get<Product>(`${this.apiURLPortal}/view_products/${id}`);
  }

  getAllManufacturers(): Observable<Manufacturer[]>{

    return this.http.get<Manufacturer[]>(`${this.apiURLPortal}/view_manufacturer`);
  }

  getManufacturerById(id: number): Observable<Manufacturer>{

    return this.http.get<Manufacturer>(`${this.apiURLPortal}/view_manufacturer/${id}`);
  }

  getAllCategories(): Observable<ProductCategory[]>{

    return this.http.get<ProductCategory[]>(`${this.apiURLPortal}/view_prod_cat`);
  }

  getCategorieById(id: number): Observable<ProductCategory>{

    return this.http.get<ProductCategory>(`${this.apiURLPortal}/view_prod_cat/${id}`);
  }

  createProduct(data: any) : Observable<any> {
    return this.http.post<any>(`${this.apiURLPortal}/add_products`, data);
  };

  updateProduct(id:number, data: any) : Observable<any> {
    return this.http.put<any>(`${this.apiURLPortal}/update_products/${id}`, data)
  };

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURLPortal}/delete_products/${id}`)
  }

  createProdCategory(data: any) : Observable<any> {
    return this.http.post<any>(`${this.apiURLPortal}/add_prod_cat`, data);
  };

  updateProdCategory(id:number, data: any) : Observable<any> {
    return this.http.put<any>(`${this.apiURLPortal}/edit_prod_cat/${id}`, data)
  };

  deleteProdCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURLPortal}/delete_prod_cat/${id}`)
  }

  createManufacturer(data: any) : Observable<any> {
    return this.http.post<any>(`${this.apiURLPortal}/add_manufacturer`, data);
  };

  updateManufacturer(id:number, data: any) : Observable<any> {
    return this.http.put<any>(`${this.apiURLPortal}/edit_manufacturer/${id}`, data)
  };

  deleteManufacturer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURLPortal}/delete_manufacturer/${id}`)
  }

  createPendingOrder(data: any) : Observable<any> {
    return this.http.post<any>(`${this.apiURLPortal}/add_pending_orders`, data);
  };

  createCustOrder(data: any) : Observable<any> {
    return this.http.post<any>(`${this.apiURLPortal}/add_cust_orders`, data);
  };

  getUserOrder(id: number): Observable<any>{
    return this.http.get<any>(`${this.apiURLPortal}/view_user_orders/${id}`)
  };

  getAllOrders(): Observable<any>{
    return this.http.get<any>(`${this.apiURLPortal}/view_pending_orders`)
  };

  getPendingOrderById(id: number): Observable<any>{
    return this.http.get<any>(`${this.apiURLPortal}/view_pending_orders/${id}`)
  };

  deleteOrderById(id: number): Observable<any>{
    return this.http.delete<any>(`${this.apiURLPortal}/delete_pending_orders/${id}`)
  };

  updatePendingOrderById(id: number, data: any):Observable<any>{
    return this.http.put<any>(`${this.apiURLPortal}/edit_pending_orders/${id}`, data);
  };

  addPayment(data: any):Observable<any>{
    return this.http.post<any>(`${this.apiURLPortal}/add_payments`, data);
  };

  getAllPayment():Observable<any>{
    return this.http.get<any>(`${this.apiURLPortal}/view_payments`);
  };

  deletePaymentById(id: number): Observable<any>{
    return this.http.delete<any>(`${this.apiURLPortal}/delete_payments/${id}`)
  };

  postProdImage(id:number, data: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('product_img1', data)
    //console.log(formData)
    return this.http.post<any>(`${this.apiURLPortal}/add_prod_image/${id}`, formData)
  };

  getAdminDash(): Observable<any> {
    return this.http.get<any>(`${this.apiURLPortal}/view_admin_dash`)
  }

}
