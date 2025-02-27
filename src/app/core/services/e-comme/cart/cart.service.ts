import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../../../../shared/environment/env';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // user token
  private userToken:string=localStorage.getItem('userToken')!;
  // Inject HttpClient service.
  private httpClient:HttpClient=inject(HttpClient);

  // Add to user cart api
  addToUserCart(pId:string):Observable<any>{
    return this.httpClient.post(`${env.baseUrl}/api/v1/cart`,{productId:pId},{headers:{token:this.userToken}});
  }
  // Update to user cart api
  updateToUserCart(pId:string,pCount:number):Observable<any>{
    return this.httpClient.put(`${env.baseUrl}/api/v1/cart/${pId}`,{count:pCount},{headers:{token:this.userToken}});
  }
  // get user cart api
  getUserCart():Observable<any>{
    return this.httpClient.get(`${env.baseUrl}/api/v1/cart`,{headers:{token:this.userToken}});
  }
  // Remove item from user cart api.
  removeItemUserCart(pId:string):Observable<any>{
    return this.httpClient.delete(`${env.baseUrl}/api/v1/cart/${pId}`,{headers:{token:this.userToken}});
  }
  // Clear user cart api.
  clearUserCart():Observable<any>{
    return this.httpClient.delete(`${env.baseUrl}/api/v1/cart`,{headers:{token:this.userToken}});
  }
}
