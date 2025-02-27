import { WishListService } from './../../../core/services/e-comme/wishList/wish-list.service';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Iproduct } from '../../interfaces/product/product';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/e-comme/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit,OnDestroy{
  heartwishFlag:boolean = false;
  addToWishProductLoading:boolean = false;
  addToCartLoading:boolean=false;
  addToCartSubscription!:Subscription;
  addToWishListSubscription!:Subscription;
  removeWishListSubscription!:Subscription;
  // required input of each product.
  @Input({required:true}) product!:Iproduct;
  // required input of each wishProduct.
  @Input({required:true}) wishList!:Iproduct[];
  // wishList emitter emit to home component when add to or remove from wishlist to update the wishList array at home component.
  @Output() wishListEmitter:EventEmitter<boolean> = new EventEmitter();
  // Inject cartService , wishListService and toastrService.
  cartService:CartService=inject(CartService);
  wishListService:WishListService=inject(WishListService);
  toastrService :ToastrService =inject(ToastrService);
  // Add to cart
  addToCart(pId:string){
    this.addToCartLoading=true;
    this.addToCartSubscription = this.cartService.addToUserCart(pId).subscribe({
      next:(res)=>{
        if(res.status==='success'){
          this.toastrService.success(`${this.product.title} added successfully to your cart`,'Cart Operations');
          this.addToCartLoading=false;
          if(this.wishList.some(elemnt=>elemnt._id===pId)){
            this.removeFromWishList(pId);
          }
        }
      },
      error:(err)=>{
        console.log(err);
        this.toastrService.error('There is a problem , try again','Cart Operations');
        this.addToCartLoading=false;
      }
    });
  };
  // Add to wishlist
  addToWishList(pId:string){
    this.addToWishProductLoading = true;
    this.addToWishListSubscription = this.wishListService.addToUserWishList(pId).subscribe({
      next:(res)=>{
        if(res.status==='success'){
          this.addToWishProductLoading = false;
          this.heartwishFlag = true;
          this.wishListEmitter.emit(true);
          this.toastrService.success(`${this.product.title} is added to your wish list`,'Cart Operations');
        }
      },
      error:(err)=>{
        this.addToWishProductLoading = false;
        this.toastrService.error(`There is a problem , try again`,'Cart Operations');
        console.log(err);
      }
    });
  }
  // Remove from wishList method.
  removeFromWishList(pId:string){
      this.addToWishProductLoading = true;
      this.removeWishListSubscription = this.wishListService.removeFromUserWishList(pId).subscribe({
        next:(res)=>{
          if(res.status==='success'){
            this.addToWishProductLoading = false;
            this.heartwishFlag = false;
            this.wishListEmitter.emit(true);
            this.toastrService.success(`${this.product.title} is removed from your wish list`,'Cart Operations');
          }
        },
        error:(err)=>{
          this.addToWishProductLoading = false;
          this.toastrService.error(`There is a problem , try again`,'Cart Operations');
          console.log(err);
        }
      });
  }
  //method to check if the product at wish list or not (Fired at onInit hook).
  checkWishList(){
    this.wishList.forEach(element => {
      if(element._id===this.product._id){
        this.heartwishFlag = true;
      }
    });
  }
  ngOnInit(): void {
    this.checkWishList(); 
  }
  ngOnDestroy(): void {
    // unsubcribe addToCartSubscription , addToWishListSubscription and removeWishListSubscription
    if(this.addToCartSubscription){
      this.addToCartSubscription.unsubscribe();
    }
    if(this.addToWishListSubscription){
      this.addToWishListSubscription.unsubscribe();
    }
    if(this.removeWishListSubscription){
      this.removeWishListSubscription.unsubscribe();
    }
  }
}
