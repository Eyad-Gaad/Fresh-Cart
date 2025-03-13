import { AuthService } from './../../../core/services/auth/auth.service';
import { Component,inject, OnDestroy, OnInit} from '@angular/core';
import { Router, RouterLink,RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavDirective } from '../../../shared/directive/nav/nav.directive';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive,NavDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit,OnDestroy{
  // Inject AuthService.
  authService:AuthService = inject(AuthService);

  isLogin!:boolean;
  subscription:Subscription = new Subscription();

  // methode to check if the user is logged or not.
  checkUserLogged(){
    const userDataSub = this.authService.userData.subscribe(()=>{
      if(this.authService.userData.getValue() == null){
        this.isLogin = false;
      }
      else{
        this.isLogin = true;
      }
    });
    this.subscription.add(userDataSub);
  }

  ngOnInit(): void {
    this.checkUserLogged();
  }

  ngOnDestroy(): void {
    // unsubscribe subscription
    this.subscription.unsubscribe();
  }
}
