import { Component, Input} from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { Icategory } from '../../interfaces/category/category';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-card',
  imports: [UpperCasePipe,RouterLink],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss'
})
export class CategoryCardComponent {
  // Required category input property.
  @Input({required:true}) category!:Icategory;
}
