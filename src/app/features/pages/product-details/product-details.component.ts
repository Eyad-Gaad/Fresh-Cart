import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../../core/services/e-comme/products/products.service';
import { Iproduct } from '../../../shared/interfaces/product/product';
import { CartService } from '../../../core/services/e-comme/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { WishListService } from '../../../core/services/e-comme/wishList/wish-list.service';
import { CurrencyPipe, LowerCasePipe, TitleCasePipe } from '@angular/common';
@Component({
  selector: 'app-product-details',
  imports: [CarouselModule,TitleCasePipe,LowerCasePipe,CurrencyPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit,OnDestroy{
  // Inject ActivatedRoute , ProductsService , CartService , wishListService and ToastrService. 
  activatedRoute:ActivatedRoute = inject(ActivatedRoute);
  productsService:ProductsService = inject(ProductsService);
  cartService:CartService=inject(CartService);
  toastrService :ToastrService =inject(ToastrService );
  wishListService:WishListService=inject(WishListService);

  // Property for owl carousel.
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }

  addToCartLoading:boolean=false;
  updateWishProductLoading:boolean = false;
  heartwishFlag:boolean = false;
  pId!:string;
  product!:Iproduct;
  wishList!:Iproduct[];
  subscription:Subscription=new Subscription();
    
  // get product id from activatedRoute for calling a specific product API.
  getProductId(){
    const paramMapSub = this.activatedRoute.paramMap.subscribe({
      next:(res)=>{
        this.pId = res.get('id')!;
      }
    });
    this.subscription.add(paramMapSub);
  }

  // get specific product
  getProduct(){
    const getProductDetailsSub = this.productsService.getSpecificProduct(this.pId).subscribe({
      next:(res)=>{
        this.product = res.data;
      }
    });
    this.subscription.add(getProductDetailsSub);
  }

  // get wishList
  getWishList(){
    const getWishListSub = this.wishListService.getUserWishList().subscribe({
      next:(res)=>{
        if(res.status==='success'){
          this.wishList = res.data;
          this.checkWishList();
        }
      }
    });
      this.subscription.add(getWishListSub);
  }

  //method to check if the product at wishList or not fired after loaded wishlist , note :- it loop and make condition based on pId property comming from routing data (ActivatedRoute) to guarantee the pId come before wishlist array cause of (async api).
  checkWishList(){
    this.wishList.forEach(element => {
      if(element._id===this.pId){
        this.heartwishFlag = true;
      }
    });
 }

  // Add to wishlist
  addToWishList(pId:string){
     this.updateWishProductLoading = true;
     const addToWishListSub = this.wishListService.addToUserWishList(pId).subscribe({
       next:(res)=>{
        if(res.status==='success'){
          this.updateWishProductLoading = false;
          this.heartwishFlag = true;
          this.toastrService.success(`${this.product.title} is added to your wish list`,'Cart Operations');
        }
      },
      error:()=>{
        this.updateWishProductLoading = false;
        this.toastrService.error(`There is a problem , try again`,'Cart Operations');
      }
    });
    this.subscription.add(addToWishListSub)
  }

  // Remove from wishList method.
  removeFromWishList(pId:string){
    this.updateWishProductLoading = true;
    const removeWishListSub = this.wishListService.removeFromUserWishList(pId).subscribe({
      next:(res)=>{
        if(res.status==='success'){
          this.updateWishProductLoading = false;
          this.heartwishFlag = false;
          this.toastrService.success(`${this.product.title} is removed from your wish list`,'Cart Operations');
        }
      },
      error:()=>{
        this.updateWishProductLoading = false;
        this.toastrService.error(`There is a problem , try again`,'Cart Operations');
      }
    });
    this.subscription.add(removeWishListSub);
  }

  // Add to cart.
  addToCart(pId:string){
      this.addToCartLoading=true;
      const addToCartSub = this.cartService.addToUserCart(pId).subscribe({
        next:(res)=>{
          if(res.status==='success'){
            this.toastrService.success(`${this.product.title} added successfully to your cart`,'Cart Operations');
            this.addToCartLoading=false;
            if(this.heartwishFlag){
              this.removeFromWishList(pId);
            }
          }
        },
        error:()=>{
          this.toastrService.error('There is an error , try again !','Cart Operations');
          this.addToCartLoading=false;
        }
      });
      this.subscription.add(addToCartSub);
  }

  ngOnInit(): void {
    this.getProductId();
    this.getProduct();
    this.getWishList();
  };

  ngOnDestroy(): void {
    // unsubscribe subscription
    this.subscription.unsubscribe();
  }
}