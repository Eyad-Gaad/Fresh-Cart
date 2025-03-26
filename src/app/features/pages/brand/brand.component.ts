import { AuthService } from './../../../core/services/auth/auth.service';
import { WishListService } from './../../../core/services/e-comme/wishList/wish-list.service';
import { ProductsService } from './../../../core/services/e-comme/products/products.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Iproduct } from '../../../shared/interfaces/product/product';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ProductSearchPipe } from '../../../shared/pipes/productSearch/product-search.pipe';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-brand',
  imports: [UpperCasePipe,TranslatePipe,ProductSearchPipe,FormsModule,ProductCardComponent],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss'
})
export class BrandComponent implements OnInit,OnDestroy{
  // Inject ActivatedRoute , AuthService , ProductsService , WishListService
  activatedRoute:ActivatedRoute = inject(ActivatedRoute);
  productsService:ProductsService = inject(ProductsService);
  wishListService:WishListService = inject(WishListService);
  authService:AuthService = inject(AuthService);

  bId!:string;
  brandName!:string;
  products!:Iproduct[];
  wishList!:Iproduct[];
  search:string='';
  subscription:Subscription=new Subscription();

  // get brand info from activatedRoute.
  getBrandInfo(){
    const brandIdSub = this.activatedRoute.paramMap.subscribe(res=>this.bId=res.get('bId')!);
    const brandNameSub = this.activatedRoute.paramMap.subscribe(res=>this.brandName=res.get('brandName')!);
    this.subscription.add(brandIdSub);
    this.subscription.add(brandNameSub);
  }

  // function to compare the matched product of a brand with th bId.
  productBasedBrand(products:Iproduct[]):Iproduct[]{
   return products.filter(product=>product.brand._id===this.bId);
  } 

  // get All product (applied shareReply on it).
  getAllProducts(){
    const getallProductsSub = this.productsService.getAllProducts().subscribe({
      next:res=>this.products=this.productBasedBrand(res.data)
    });
    this.subscription.add(getallProductsSub);
  }

  // get user wishList.
  getUserWishList(){
    if(this.authService.checkAuthorizedUser()){
      const getWishListSub = this.wishListService.getUserWishList().subscribe({
        next:res=>this.wishList = res.data
      });
      this.subscription.add(getWishListSub);
    }
  }

  ngOnInit(): void {
    this.getBrandInfo();
    this.getAllProducts();
    this.getUserWishList();
  }

  ngOnDestroy(): void {
    // unsubscribe subscription
    this.subscription.unsubscribe()
  }
}