import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Icategory } from '../../interfaces/product/product';

@Component({
  selector: 'app-category-card',
  imports: [],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss'
})
export class CategoryCardComponent {
  // Required category input property.
  @Input({required:true}) category!:Icategory;
  // Output boolean emitter and specific id category.
  @Output() emitter:EventEmitter<boolean> = new EventEmitter();
  @Output() categoryId:EventEmitter<string> = new EventEmitter();
  emit(){
    this.categoryId.emit(this.category._id);
    this.emitter.emit(true);
  }
}
