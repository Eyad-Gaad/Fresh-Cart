import { WishListService } from './../../../core/services/e-comme/wishList/wish-list.service';
import { Component, DoCheck, inject, OnDestroy, OnInit } from '@angular/core';
import { WishProductComponent } from "../../../shared/components/wish-product/wish-product.component";
import { Subscription } from 'rxjs';
import { Iproduct } from '../../../shared/interfaces/product/product';

@Component({
  selector: 'app-wish-list',
  imports: [WishProductComponent],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.scss'
})
export class WishListComponent implements OnInit,DoCheck,OnDestroy{
  ItemEmitter!:boolean; // 'flag' Coming from child component.
  wishListCount!:number;
  wishList!:Iproduct[];
  getWishListSubscription!:Subscription;
  // Inject WishListService.
  wishListService:WishListService = inject(WishListService);
  //Get wishList
  getWishList(){
    this.ItemEmitter = false;
    this.getWishListSubscription = this.wishListService.getUserWishList().subscribe({
      next:(res)=>{
        this.wishListCount = res.count;
        this.wishList = res.data;
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }
  ngOnInit(): void {
    this.getWishList();
  }
  ngDoCheck(): void {
    if(this.ItemEmitter===true){
      this.getWishList();
    }
  }
  ngOnDestroy(): void {
    // unsubscribe getWishListSubscription.
    this.getWishListSubscription.unsubscribe();
  }
}
