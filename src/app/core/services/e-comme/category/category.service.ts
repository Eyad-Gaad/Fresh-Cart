import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../../../../shared/environment/env';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // Inject HttpClient srvice.
  httpClient:HttpClient = inject(HttpClient);
  // Get all categories
  getAllCategories():Observable<any>{
    return this.httpClient.get(`${env.baseUrl}/api/v1/categories`);
  }
  // Get specific category
  getSpecificCategoru(cId:string):Observable<any>{
    return this.httpClient.get(`${env.baseUrl}/api/v1/categories/${cId}`);
  }
  // Get All subcategories of specific category.
  getSubCategoriesOfCategory(cId:string):Observable<any>{
    return this.httpClient.get(`${env.baseUrl}/api/v1/categories/${cId}/subcategories`);
  }
}
