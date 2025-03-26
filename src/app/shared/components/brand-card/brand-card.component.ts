import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { Ibrand } from '../../interfaces/brand/brand';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brand-card',
  imports: [UpperCasePipe,RouterLink],
  templateUrl: './brand-card.component.html',
  styleUrl: './brand-card.component.scss'
})
export class BrandCardComponent {
  // Required brand input.
  @Input({required:true}) brand!:Ibrand;
}