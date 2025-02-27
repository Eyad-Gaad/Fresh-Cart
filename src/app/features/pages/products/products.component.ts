import {Subscription } from 'rxjs';
import { ProductsService } from './../../../core/services/e-comme/products/products.service';
import { Component, DoCheck, inject, OnDestroy, OnInit } from '@angular/core';
import { Iproduct } from '../../../shared/interfaces/product/product';
import { CardComponent } from "../../../shared/components/card/card.component";
import { Router } from '@angular/router';
import { WishListService } from '../../../core/services/e-comme/wishList/wish-list.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [CardComponent,FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit,DoCheck,OnDestroy{
  search:string='';
  getProductsSubscription!:Subscription;
  wishListSubscription!:Subscription;
  products!:Iproduct[];
  wishList!:Iproduct[];
  wishListEmitter!:boolean; // value emitted from child card component to update the wishList array; 
  //Inject AuthService , WishListService and router service.
  productsService:ProductsService = inject(ProductsService);
  wishListService:WishListService=inject(WishListService);
  router:Router = inject(Router);
  // get all products.
  getProducts(){
    this.getProductsSubscription =this.productsService.getAllProducts().subscribe({
      next:(res)=>{
        this.products=res.data;
      },
      error:(err)=>{
        //Route to pageNotFound.
        this.router.navigate(['**']);
        console.log(err);
      }
    });
  }
  // get wishList
  getWishList(){
    this.wishListEmitter = false;
    this.wishListSubscription = this.wishListService.getUserWishList().subscribe({
      next:(res)=>{
        if(res.status==='success'){
          this.wishList = res.data;
        }
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }
  ngOnInit(): void {
    this.getProducts();
    this.getWishList();
  }
  ngDoCheck(): void {
    if(this.wishListEmitter){
      this.getWishList();
    }
  }
  ngOnDestroy(): void {
    // unsubscribe getProductsSubscription and wishListSubscription.
    this.getProductsSubscription.unsubscribe();
    this.wishListSubscription.unsubscribe();
  }
}
