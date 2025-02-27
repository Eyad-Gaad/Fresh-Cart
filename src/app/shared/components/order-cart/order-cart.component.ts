import { Component, Input } from '@angular/core';
import { Iorder } from '../../interfaces/order/order';

@Component({
  selector: 'app-order-cart',
  imports: [],
  templateUrl: './order-cart.component.html',
  styleUrl: './order-cart.component.scss'
})
export class OrderCartComponent {
  // Required orderCart input.
  @Input({required:true}) orderCart!:Iorder;
}
