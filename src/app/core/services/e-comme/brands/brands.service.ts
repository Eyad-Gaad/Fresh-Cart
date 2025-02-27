import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../../../../shared/environment/env';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  // Inject HttpClient service.
  httpClient:HttpClient = inject(HttpClient);
  // Get all brands.
  getAllBrands():Observable<any>{
    return this.httpClient.get(`${env.baseUrl}/api/v1/brands`);
  }
  // Get specific brand.
  getSpecificBrands(bId:string):Observable<any>{
    return this.httpClient.get(`${env.baseUrl}/api/v1/brands/${bId}`);
  }
}
