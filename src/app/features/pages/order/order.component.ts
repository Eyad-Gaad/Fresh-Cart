import { ToastrService } from 'ngx-toastr';
import { OrderService } from './../../../core/services/e-comme/order/order.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
@Component({
  selector: 'app-order',
  imports: [ReactiveFormsModule,AlertComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit,OnDestroy{
  cId!:string;
  OnlineSpinnerLoading:boolean = false;
  cashSpinnerLoading:boolean = false;
  paramMapSubscription!:Subscription;
  payOnlineSubscription!:Subscription;
  cashOrderSubscription!:Subscription;
  // Inject ActivatedRoute sercive and OrderService.
  activatedRoute:ActivatedRoute=inject(ActivatedRoute);
  router:Router=inject(Router);
  orderService:OrderService=inject(OrderService);
  toastrService:ToastrService=inject(ToastrService);
  checkOutInformation:FormGroup = new FormGroup({
    details:new FormControl(null,[Validators.maxLength(200)]),
    phone: new FormControl(null,[Validators.required,Validators.pattern(/^(01)[0125][0-9]{8}$/)]),
    city: new FormControl(null,[Validators.required,Validators.pattern(/^.{2,50}$/)])
  });
  // get cart ID from ActivatedRoute service.
  getCartId(){
    this.paramMapSubscription = this.activatedRoute.paramMap.subscribe(res=>{this.cId = res.get('cId')!});
  }
  // Pay online function.
  payOnline(){
    if(this.checkOutInformation.valid){
      this.OnlineSpinnerLoading = true;
      this.payOnlineSubscription = this.orderService.onlineCheckOut(this.cId,this.checkOutInformation.value).subscribe({
        next:(res)=>{
          if(res.status==='success'){
            window.location.href = res.session.url;
            this.OnlineSpinnerLoading = false;
          }
        },
        error:(err)=>{
          this.OnlineSpinnerLoading = false;
          this.toastrService.error(`There is a problem , try again !` , `Payment Operation`);
        }
      });
    };
  }
  // Cash order function.
  cashOrder(){
    if(this.checkOutInformation.valid){
      this.cashSpinnerLoading = true;
      this.cashOrderSubscription = this.orderService.cashCheckOut(this.cId,this.checkOutInformation.value).subscribe({
        next:(res)=>{
          if(res.status==='success'){
            this.cashSpinnerLoading = false;
            this.toastrService.success(`Success , total price :  ${res.data.totalOrderPrice} delivers to ${res.data.shippingAddress.city}` , `Payement Operation`);
            this.router.navigate(['/allorders']);
          }
        },
        error:(err)=>{
          this.cashSpinnerLoading = false;
          this.toastrService.error(`There is a problem , try again !` , `Payement Operation`);
          console.log(err);
          this.router.navigate(['/cart']);
        }
      });
    }
  }
  ngOnInit(): void {
    this.getCartId();
  }
  ngOnDestroy(): void {
    // unsubscribe paramMapSubscription , cashOrderSubscription and payOnlineSubscription.
    this.paramMapSubscription.unsubscribe();
    if(this.payOnlineSubscription){
      this.payOnlineSubscription.unsubscribe();
    }
    if(this.cashOrderSubscription){
      this.cashOrderSubscription.unsubscribe();
    }
  }
}
