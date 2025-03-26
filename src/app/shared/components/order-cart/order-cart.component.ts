import { Component, Input } from '@angular/core';
import { Iorder } from '../../interfaces/order/order';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-order-cart',
  imports: [TitleCasePipe,TranslatePipe],
  templateUrl: './order-cart.component.html',
  styleUrl: './order-cart.component.scss'
})
export class OrderCartComponent {
  // Required orderCart input.
  @Input({required:true}) orderCart!:Iorder;
}
