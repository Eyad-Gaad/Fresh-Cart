import { CategoryService } from './../../../core/services/e-comme/category/category.service';
import { BrandsService } from './../../../core/services/e-comme/brands/brands.service';
import {Subscription } from 'rxjs';
import { ProductsService } from './../../../core/services/e-comme/products/products.service';
import { Component, DoCheck, inject, OnDestroy, OnInit } from '@angular/core';
import { Icategory, Iproduct } from '../../../shared/interfaces/product/product';
import { CardComponent } from "../../../shared/components/card/card.component";
import { Router } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Ibrand } from '../../../shared/interfaces/brand/brand';
import { WishListService } from '../../../core/services/e-comme/wishList/wish-list.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-home',
  imports: [CardComponent,CarouselModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit,DoCheck,OnDestroy{
  // Properties for owl carousel.
  customOptions1: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
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
    nav: true,
    autoplay:true,
    autoplayTimeout:2000,
    autoplayHoverPause:true,
  }
  customOptions2: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true,
    autoplay:true,
    autoplayTimeout:2000,
    autoplayHoverPause:true,
    autoHeight:true
  }
  search:string='';
  getProductsSubscription!:Subscription;
  getBrandsSubscription!:Subscription;
  getCategoriesSubscription!:Subscription;
  wishListSubscription!:Subscription;
  products!:Iproduct[];
  brands!:Ibrand[];
  categories!:Icategory[];
  wishList!:Iproduct[];
  wishListEmitter!:boolean; // value emitted from child card component to update the wishList array; 
  //Inject AuthService , BrandsService , CategoryService , WishListService and router service.
  productsService:ProductsService = inject(ProductsService);
  brandsService:BrandsService = inject(BrandsService);
  categoryService:CategoryService = inject(CategoryService);
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
  // get all brands
  getBrands(){
    this.getBrandsSubscription = this.brandsService.getAllBrands().subscribe({
      next:(res)=>{
        this.brands = res.data;
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }
  // get all Categories.
  getCategories(){
    this.getCategoriesSubscription =  this.categoryService.getAllCategories().subscribe({
      next:(res)=>{
        this.categories = res.data;
      },
      error:(err)=>{
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
    this.getCategories();
    this.getBrands();
    this.getWishList();
  }
  ngDoCheck(): void {
    if(this.wishListEmitter){
      this.getWishList();
    }
  }
  ngOnDestroy(): void {
    // unsubscribe getProductsSubscription , getBrandsSubscription و wishListSubscription and getCategoriesSubscription.
    this.getProductsSubscription.unsubscribe();
    this.getBrandsSubscription.unsubscribe();
    this.getCategoriesSubscription.unsubscribe();
    this.wishListSubscription.unsubscribe();
  }
}