import { AuthService } from './../../../core/services/auth/auth.service';
import { Component,ElementRef,inject, OnDestroy, OnInit, QueryList, Renderer2, ViewChildren} from '@angular/core';
import { RouterLink,RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavDirective } from '../../../shared/directive/nav/nav.directive';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive,NavDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit,OnDestroy{
  // Inject AuthService and Renderer2
  authService:AuthService = inject(AuthService);
  renderer2:Renderer2 = inject(Renderer2);

  @ViewChildren('menu') menu!:QueryList<any>;
  isLogin!:boolean;
  subscription:Subscription = new Subscription();

  // dropDownNavbar method (manipulate DOM by usin renderer2)
  dropDownNavbar(){
    this.menu.forEach((el:ElementRef)=>{
      if(el.nativeElement.classList.contains('hidden')){
        this.renderer2.removeClass(el.nativeElement,'hidden')
        this.renderer2.addClass(el.nativeElement,'flex')
      }
      else{
        this.renderer2.removeClass(el.nativeElement,'flex')
        this.renderer2.addClass(el.nativeElement,'hidden')
      }
    });
  }

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
