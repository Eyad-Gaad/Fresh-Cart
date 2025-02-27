import { Subscription } from 'rxjs';
import { CategoryService } from './../../../core/services/e-comme/category/category.service';
import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-subcategories',
  imports: [],
  templateUrl: './subcategories.component.html',
  styleUrl: './subcategories.component.scss'
})
export class SubcategoriesComponent implements OnChanges,OnInit,OnDestroy{
  @Input() categoryId!:string;
  subCategories!:any[];
  getSubCategoriesSubscription!:Subscription;
  //  Inject CategoryService
  categoryService:CategoryService = inject(CategoryService);
  getSubCategories(){
    this.getSubCategoriesSubscription = this.categoryService.getSubCategoriesOfCategory(this.categoryId).subscribe({
      next:(res)=>{
        this.subCategories = res.data;
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getSubCategories();
  }
  ngOnInit(): void {
    this.getSubCategories();
  }
  ngOnDestroy(): void {
    // unsubscribe getSubCategoriesSubscription.
    this.getSubCategoriesSubscription.unsubscribe();
  }
}
