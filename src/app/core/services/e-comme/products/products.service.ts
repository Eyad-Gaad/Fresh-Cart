import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../../../../shared/environment/env';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  // Inject HttpClient service.
  httpClient:HttpClient = inject(HttpClient);
  getAllProducts():Observable<any>{
    return this.httpClient.get(`${env.baseUrl}/api/v1/products`);
  }
  getSpecificProduct(pId:string|null):Observable<any>{
    return this.httpClient.get(`${env.baseUrl}/api/v1/products/${pId}`);
  }
}
