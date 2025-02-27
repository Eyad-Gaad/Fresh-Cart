import { CartService } from './../../../core/services/e-comme/cart/cart.service';
import { WishListService } from './../../../core/services/e-comme/wishList/wish-list.service';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Iproduct } from '../../interfaces/product/product';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wish-product',
  imports: [],
  templateUrl: './wish-product.component.html',
  styleUrl: './wish-product.component.scss'
})
export class WishProductComponent implements OnDestroy{
  addToCartLoading:boolean=false;
  removeWishProductLoading:boolean = false;
  removeWishListSubscription!:Subscription;
  addTocartSubscription!:Subscription;

// Required wishProduct input coming from wishList component.
  @Input({required:true}) wishProduct!:Iproduct;
  // Output boolean data to parent component to DoCheck about any cartProduct change (Item Emitter)
  @Output() ItemEmitter:EventEmitter<boolean>=new EventEmitter();
// Inject WishListService, CartService and ToastrService.
  wishListService:WishListService = inject(WishListService);
  cartService:CartService = inject(CartService);
  toastrService:ToastrService = inject(ToastrService);
  // Remove from wishList method.
  removeFromWishList(pId:string){
    this.removeWishProductLoading = true;
    this.removeWishListSubscription = this.wishListService.removeFromUserWishList(pId).subscribe({
      next:(res)=>{
        if(res.status==='success'){
          this.ItemEmitter.emit(true);
          this.removeWishProductLoading = false;
          this.toastrService.success(`${this.wishProduct.title} is removed from your wish list`,'Cart Operations');
        }
      },
      error:(err)=>{
        this.removeWishProductLoading = false;
        this.toastrService.error(`There is a problem , try again`,'Cart Operations');
        console.log(err);
      }
    });
  }
  // Add to cart method
  addToCart(pId:string){
    this.addToCartLoading = true;
    this.addTocartSubscription = this.cartService.addToUserCart(pId).subscribe({
      next:(res)=>{
        if(res.status==='success'){
          this.addToCartLoading = false;
          this.toastrService.success(`${this.wishProduct.title} added successfully to your cart`,'Cart Operations');
          this.removeFromWishList(pId);
        }
      },
      error:(err)=>{
        this.addToCartLoading = false;
        this.toastrService.error(`There is a problem , try again`,'Cart Operations');
        console.log(err);
      }
    });
  }
  ngOnDestroy(): void {
    // unsubscribe removeWishListSubscription and addTocartSubscription.
    if(this.removeWishListSubscription){
      this.removeWishListSubscription.unsubscribe();
    }
    if(this.addTocartSubscription){
      this.addTocartSubscription.unsubscribe();
    }
  }
}
