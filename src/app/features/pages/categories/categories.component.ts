import { CategoryService } from './../../../core/services/e-comme/category/category.service';
import { Component, DoCheck, inject, OnDestroy, OnInit } from '@angular/core';
import { Icategory } from '../../../shared/interfaces/product/product';
import { Subscription } from 'rxjs';
import { CategoryCardComponent } from '../../../shared/components/category-card/category-card.component';
import { SubcategoriesComponent } from "../../../shared/components/subcategories/subcategories.component";

@Component({
  selector: 'app-categories',
  imports: [CategoryCardComponent, SubcategoriesComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit,DoCheck,OnDestroy{
  deferFlag:boolean = false;
  emiiter!:boolean
  categoryId!:string
  categories!:Icategory[];
  categoriesSubscription!:Subscription;
  // Inject CategoryService.
  categoryService:CategoryService = inject(CategoryService);
  //Get All categories
  getcategories(){
    this.categoriesSubscription = this.categoryService.getAllCategories().subscribe({
        next:(res)=>{
          this.categories = res.data;
        },
        error:(err)=>{
          console.log(err);
        }
    });
  }
  ngOnInit(): void {
    this.getcategories();
  }
  ngDoCheck(): void {
    if(this.emiiter===true){
      this.deferFlag = true;
    }
  }
  ngOnDestroy(): void {
    // unsubscribe categoriesSubscription.
    this.categoriesSubscription.unsubscribe();
  }
}
