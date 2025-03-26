import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../core/services/e-comme/products/products.service';
import { WishListService } from '../../../core/services/e-comme/wishList/wish-list.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Iproduct } from '../../../shared/interfaces/product/product';
import { Subscription } from 'rxjs';
import { UpperCasePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ProductSearchPipe } from '../../../shared/pipes/productSearch/product-search.pipe';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-category',
  imports: [UpperCasePipe,TranslatePipe,ProductSearchPipe,FormsModule,ProductCardComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit,OnDestroy{
    // Inject ActivatedRoute , AuthService , ProductsService , WishListService
    activatedRoute:ActivatedRoute = inject(ActivatedRoute);
    productsService:ProductsService = inject(ProductsService);
    wishListService:WishListService = inject(WishListService);
    authService:AuthService = inject(AuthService);
  
    cId!:string;
    categoryName!:string;
    products!:Iproduct[];
    wishList!:Iproduct[];
    search:string='';
    subscription:Subscription=new Subscription();
  
    // get category info from activatedRoute.
    getCategoryInfo(){
      const categoryIdSub = this.activatedRoute.paramMap.subscribe(res=>this.cId=res.get('cId')!);
      const categorydNameSub = this.activatedRoute.paramMap.subscribe(res=>this.categoryName=res.get('categoryName')!);
      this.subscription.add(categoryIdSub);
      this.subscription.add(categorydNameSub);
    }
  
    // function to compare the matched product of a category with th cId.
    productBasedCategory(products:Iproduct[]):Iproduct[]{
     return products.filter(product=>product.category._id===this.cId);
    } 
  
    // get All product (applied shareReply on it).
    getAllProducts(){
      const getallProductsSub = this.productsService.getAllProducts().subscribe({
       next:res=>this.products=this.productBasedCategory(res.data)
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
      this.getCategoryInfo();
      this.getAllProducts();
      this.getUserWishList();
    }
  
    ngOnDestroy(): void {
      // unsubscribe subscription
      this.subscription.unsubscribe()
    }
}
