import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../../core/services/e-comme/products/products.service';
import { Iproduct } from '../../../shared/interfaces/product/product';
import { CartService } from '../../../core/services/e-comme/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { WishListService } from '../../../core/services/e-comme/wishList/wish-list.service';
@Component({
  selector: 'app-product-details',
  imports: [CarouselModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit,OnDestroy{
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
  heartwishFlag:boolean = false;
  addToWishProductLoading:boolean = false;
  pId!:string;
  product!:Iproduct;
  wishList!:Iproduct[];
  paramMapSubscription!:Subscription
  getProductDetailsSubscription!:Subscription
  addToCartSubscription!:Subscription
  getWishListSubscription!:Subscription;
  addToWishListSubscription!:Subscription;
  removeWishListSubscription!:Subscription;
  // Inject ActivatedRoute , ProductsService , CartService , wishListService , ToastrService and Router service. 
  activatedRoute:ActivatedRoute = inject(ActivatedRoute);
  productsService:ProductsService = inject(ProductsService);
  cartService:CartService=inject(CartService);
  toastrService :ToastrService =inject(ToastrService );
  wishListService:WishListService=inject(WishListService);
  router:Router = inject(Router);
  // get product id from activatedRoute for calling a specific product API.
  getProductId(){
    this.paramMapSubscription = this.activatedRoute.paramMap.subscribe({
      next:(res)=>{
        this.pId = res.get('id')!;
      },
      error:(err)=>{
        this.router.navigate(['**']);
        console.log(err);
      }
    });
  };
  // get specific product
  getProduct(){
    this.getProductDetailsSubscription = this.productsService.getSpecificProduct(this.pId).subscribe({
      next:(res)=>{
        this.product = res.data;
      },
      error:(err)=>{
        this.router.navigate(['**']);
        console.log(err);
      }
    });
  };
  // Add to cart.
  addToCart(pId:string){
      this.addToCartLoading=true;
      this.addToCartSubscription = this.cartService.addToUserCart(pId).subscribe({
        next:(res)=>{
          if(res.status==='success'){
            console.log(res);
            this.toastrService.success(`${this.product.title} added successfully to your cart`,'Cart Operations');
            this.addToCartLoading=false;
            if(this.wishList.some(element=>element._id===pId)){
              this.removeFromWishList(pId);
            }
          }
        },
        error:(err)=>{
          console.log(err);
          this.toastrService.error('There is an error , try again !','Cart Operations');
          this.addToCartLoading=false;
        }
      });
  };
  // get wishList
  getWishList(){
      this.getWishListSubscription = this.wishListService.getUserWishList().subscribe({
        next:(res)=>{
          if(res.status==='success'){
            this.wishList = res.data;
            this.checkWishList();
          }
        },
        error:(err)=>{
          console.log(err);
        }
      });
  }
  // Add to wishlist
  addToWishList(pId:string){
      this.addToWishProductLoading = true;
      this.addToWishListSubscription = this.wishListService.addToUserWishList(pId).subscribe({
        next:(res)=>{
          if(res.status==='success'){
            this.addToWishProductLoading = false;
            this.heartwishFlag = true;
            this.getWishList();//update wislList array.
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
            this.getWishList();//update wishList array.
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
  //method to check if the product at wish list or not fired after loaded wishlist (async api).
  checkWishList(){
      this.wishList.forEach(element => {
        if(element._id===this.product._id){
          this.heartwishFlag = true;
          console.log(true);
        }
      });
  }
  ngOnInit(): void {
    this.getProductId();
    this.getProduct();
    this.getWishList();
  };
  ngOnDestroy(): void {
    // unsubscribe paramMapSubscription , getProductDetailsSubscription , addToCartSubscription , getWishListSubscription , addToWishListSubscription , removeWishListSubscription.
    this.paramMapSubscription.unsubscribe(); 
    this.getProductDetailsSubscription.unsubscribe(); 
    this.getWishListSubscription.unsubscribe();
    if(this.addToCartSubscription){
      this.addToCartSubscription.unsubscribe();
    }
    if(this.addToWishListSubscription){
      this.addToWishListSubscription.unsubscribe();
    }
    if(this.removeWishListSubscription){
      this.removeWishListSubscription.unsubscribe();
    }
  };
}