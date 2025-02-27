import { AuthService } from './../../../core/services/auth/auth.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink,RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit,OnDestroy{
  isLogin:boolean = false;
  authsubscription!:Subscription;
  // inject AuthService.
   authService:AuthService = inject(AuthService);
  ngOnInit(): void {
    this.authsubscription = this.authService.userData.subscribe(()=>{
      if(this.authService.userData.getValue() == null){
        this.isLogin = false;
      }
      else{
        this.isLogin = true;
      }
    });
  }
  ngOnDestroy(): void {
    this.authsubscription.unsubscribe();
  }
}
