import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../../../../shared/environment/env';

@Injectable({
  providedIn: 'root'
})
export class WishListService {
  // user token
  private userToken:string=localStorage.getItem('userToken')!;
  // Inject HttpClient service.
  httpClient:HttpClient = inject(HttpClient);

  // Add to user wishList.
  addToUserWishList(pId:string):Observable<any>{
    return this.httpClient.post(`${env.baseUrl}/api/v1/wishlist`,{productId:pId},{headers:{token:this.userToken}});
  }
  // Get user wishList.
  getUserWishList():Observable<any>{
    return this.httpClient.get(`${env.baseUrl}/api/v1/wishlist`,{headers:{token:this.userToken}});
  }
  // Remove from user wishList
  removeFromUserWishList(pId:string):Observable<any>{
    return this.httpClient.delete(`${env.baseUrl}/api/v1/wishlist/${pId}`,{headers:{token:this.userToken}});
  }
}
