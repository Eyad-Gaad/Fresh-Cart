import { Component, EventEmitter, inject, Input, OnDestroy, Output} from '@angular/core';
import { ICartProduct } from '../../interfaces/cartProduct/cart-product';
import { CartService } from '../../../core/services/e-comme/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-product',
  imports: [],
  templateUrl: './cart-product.component.html',
  styleUrl: './cart-product.component.scss'
})
export class CartProductComponent implements OnDestroy{
  removeItemLoading:boolean = false;
  updateItemLoading:boolean = false;
  removeItemSubscription!:Subscription;
  updateItemSubscription!:Subscription;

  // Required cartProduct input coming from cart component.
  @Input({required:true}) cartProduct!:ICartProduct;
  // Output boolean data to parent component to DoCheck about any cartProduct change (Item Emitter)
  @Output() ItemEmitter:EventEmitter<boolean> = new EventEmitter();

  // Inject CartService , ToastrService and Router.
  cartService:CartService = inject(CartService);
  toastrService:ToastrService = inject(ToastrService);

  // Remove specific item.
  removeItem(pId:string){
    this.removeItemLoading =true;
    this.removeItemSubscription = this.cartService.removeItemUserCart(pId).subscribe({
      next:(res)=>{
        if(res.status==='success'){
          this.ItemEmitter.emit(true);
          this.removeItemLoading =false;
          if(res.data.products.length===0){
            this.toastrService.success('All cart is clear','Cart Operations');
          }
          else{
            this.toastrService.success(`${this.cartProduct.product.title} is removed`,'Cart Operations');
          }
        }
      },
      error:(err)=>{
        this.removeItemLoading =false;
        console.log(err);
      }
    });
  }
  // update Product Count.
  updateItemCount(pId:string,pCount:number){
    this.updateItemLoading = true;
    this.updateItemSubscription = this.cartService.updateToUserCart(pId,pCount).subscribe({
      next:(res)=>{
        this.ItemEmitter.emit(true);
        this.updateItemLoading = false;
        if(res.status==='success'){
          if(res.data.products.length===0){
            this.toastrService.success('All cart is clear','Cart Operations');
          }
         else if(pCount===0){
            this.toastrService.success(`${this.cartProduct.product.title} is removed`,`Cart Operations`);
          }
          else{
            this.toastrService.success(`${this.cartProduct.product.title} is updated to ${pCount} count`,`Cart Operations`);
          }
        }
      },
      error:(err)=>{
        this.updateItemLoading = false;
        this.toastrService.error(`There is a problem , try again !`,'Cart Operations');
        console.log(err);
      }
    });
  }
  ngOnDestroy(): void {
    // unsubscribe removeItemSubscription and updateItemSubscription.
    if(this.removeItemSubscription){
      this.removeItemSubscription.unsubscribe();
    }
    if(this.updateItemSubscription){
      this.updateItemSubscription.unsubscribe();
    }
  }
}
