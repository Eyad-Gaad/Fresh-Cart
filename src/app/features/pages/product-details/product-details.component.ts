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
import { LowerCasePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { TranslatePipe } from '@ngx-translate/core';
import { CategoryComponent } from '../category/category.component';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
@Component({
  selector: 'app-product-details',
  imports: [CarouselModule,TitleCasePipe,LowerCasePipe,UpperCasePipe,TranslatePipe,ProductCardComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit,OnDestroy{
  // Inject ActivatedRoute , ProductsService , CartService , AuthService , wishListService , router , ToastrService and CartCountService. 
  activatedRoute:ActivatedRoute = inject(ActivatedRoute);
  productsService:ProductsService = inject(ProductsService);
  cartService:CartService=inject(CartService);
  authService:AuthService=inject(AuthService);
  toastrService :ToastrService =inject(ToastrService );
  wishListService:WishListService=inject(WishListService);
  router:Router=inject(Router);

  // Property for owl carousel.
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    rtl:true,
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
  cId!:string;
  product!:Iproduct;
  categoryName!:string;
  similarProducts!:Iproduct[];
  wishList!:Iproduct[];
  subscription:Subscription=new Subscription();    

  // get product id from activatedRoute for calling a specific product API.
  getProductInfo(){
    const paramMapSub = this.activatedRoute.paramMap.subscribe({
      next:(res)=>{
        this.pId = res.get('pId')!;
        this.cId = res.get('cId')!;
        this.categoryName = res.get('categoryName')!;
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

  // function to compare the matched product of a category with th cId.
  productBasedCategory(products:Iproduct[]):Iproduct[]{
    return products.filter(product=>product.category._id===this.cId&&product._id!=this.pId);
  } 

  // see similar products based on category.
  seeMore(){
    const similarProductsSub = this.productsService.getAllProducts().subscribe({
      next:res=>{
        this.similarProducts=this.productBasedCategory(res.data);
        console.log(this.similarProducts);
      }
    });
    this.subscription.add(similarProductsSub)
  }

  // get wishList
  getWishList(){
    if(this.authService.checkAuthorizedUser()){
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
    if(this.authService.checkAuthorizedUser()){
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
    else{
      this.router.navigate(['/logIn']);
      this.toastrService.error('You are not authorized , please LogIn','Authentication');
    }
  }

  // Remove from wishList method.
  removeFromWishList(pId:string){
    if(this.authService.checkAuthorizedUser()){
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
    else{
      this.router.navigate(['/logIn']);
      this.toastrService.error('You are not authorized , please LogIn','Authentication');
    }
  }

  // Add to cart.
  addToCart(pId:string){
    if(this.authService.checkAuthorizedUser()){
      this.addToCartLoading=true;
      const addToCartSub = this.cartService.addToUserCart(pId).subscribe({
        next:(res)=>{
          if(res.status==='success'){
            this.toastrService.success(`${this.product.title} added successfully to your cart`,'Cart Operations');
            this.addToCartLoading=false;
            if(this.heartwishFlag){
              this.removeFromWishList(pId);
            }
            this.cartService.userCartCount.next(res.numOfCartItems);
          }
        },
        error:()=>{
          this.toastrService.error('There is an error , try again !','Cart Operations');
          this.addToCartLoading=false;
        }
      });
      this.subscription.add(addToCartSub);
    }
    else{
      this.router.navigate(['/logIn']);
      this.toastrService.error('You are not authorized , please LogIn','Authentication');
    }
  }

  ngOnInit(): void {
    this.getProductInfo();
    this.getProduct();
    this.getWishList();
  };

  ngOnDestroy(): void {
    // unsubscribe subscription
    this.subscription.unsubscribe();
  }
}