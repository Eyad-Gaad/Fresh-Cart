import { AuthService } from './../../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from './../../../core/services/e-comme/cart/cart.service';
import { AfterViewChecked, Component, DoCheck, inject, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import { CartProductComponent } from "../../../shared/components/cart-product/cart-product.component";
import { Subscription } from 'rxjs';
import { ICartProduct } from '../../../shared/interfaces/cartProduct/cart-product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CartProductComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit,DoCheck,OnDestroy{
  ItemEmitter!:boolean; // 'flag' Coming from child component.
  cartProducts!:ICartProduct[];
  totalCartPrice!:number;
  numOfCartItems!:number;
  cId!:string;
  gatCartSubscription!:Subscription;
  clearCartSubscription!:Subscription;
  clearLoading:boolean = false;
  // Inject CartService , ToastrService and Router.
  cartService:CartService = inject(CartService);
  authService:AuthService = inject(AuthService);
  toastrService:ToastrService = inject(ToastrService);
  router:Router = inject(Router);
  // Get User Cart.
  getCart(){
    this.ItemEmitter=false;
    this.gatCartSubscription = this.cartService.getUserCart().subscribe({
      next:(res)=>{
        this.totalCartPrice = res.data.totalCartPrice;
        this.cartProducts = res.data.products;
        this.numOfCartItems = res.numOfCartItems;
        this.cId = res.cartId;
      },
      error:(err)=>{
        this.toastrService.error('There is a problem , try again !' , 'Cart Operations');
        this.router.navigate(['/home']);
        console.log(err);
      }
    });
  }
  // Clear all cart.
  clearCart(){
    if(this.cartProducts.length!=0){
      this.clearLoading = true;
      this.clearCartSubscription = this.cartService.clearUserCart().subscribe({
        next:(res)=>{
          if(res.message==="success"){
            this.getCart(); 
            this.clearLoading = false;
            this.toastrService.success('All cart is clear','Cart Operations');
          }
        },
        error:(err)=>{   
          this.clearLoading = false; 
          this.toastrService.error('There is a problem , try again !','Cart Operations');
          console.log(err);
        }
      });
    }
    else{
      this.toastrService.error('The cart is arledy cleared !');
    }
  }
  // Route to order page.
  routeToOrder(){
    if(this.cartProducts.length!=0){
      this.router.navigate(['/order',this.cId]);
    }
    else{
      this.toastrService.error('The cart is empty!');
    }
  }
  ngOnInit(): void {
    this.getCart();
  }
  ngDoCheck(): void {
    // Check if it is any emiiting comming from child component.
    if(this.ItemEmitter===true){
      this.getCart();
    }
  }
  ngOnDestroy(): void {
    // unsubscribe gatCartSubscription and clearCartSubscription.
    this.gatCartSubscription.unsubscribe();
    if(this.clearCartSubscription){
      this.clearCartSubscription.unsubscribe();
    }
  }
}
