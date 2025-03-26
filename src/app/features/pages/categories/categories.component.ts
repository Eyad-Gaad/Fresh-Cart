import { CategoryService } from './../../../core/services/e-comme/category/category.service';
import { Component,inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryCardComponent } from '../../../shared/components/category-card/category-card.component';
import { FormsModule } from '@angular/forms';
import { CategorySearchPipe } from '../../../shared/pipes/categorySearch/category-search.pipe';
import { Icategory } from '../../../shared/interfaces/category/category';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-categories',
  imports: [CategoryCardComponent,FormsModule,CategorySearchPipe,TranslatePipe],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit,OnDestroy{
  // Inject CategoryService.
  categoryService:CategoryService = inject(CategoryService);

  search:string='';
  categories!:Icategory[];
  subscription:Subscription = new Subscription();
  
  //Get All categories
  getcategories(){
    const categoriesSub = this.categoryService.getAllCategories().subscribe({
        next:(res)=>{
          this.categories = res;
        }
    });
    this.subscription.add(categoriesSub)
  }

  ngOnInit(): void {
    this.getcategories();
  }

  ngOnDestroy(): void {
    // unsubscribe subscription
    this.subscription.unsubscribe();
  }
}
