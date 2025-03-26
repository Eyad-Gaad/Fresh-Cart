import { TranslatePipe } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from './../../../core/services/auth/auth.service';
import { Component, inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule,AlertComponent,TranslatePipe],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnDestroy{
  // Inject AuthService , router and ToastrService
  authService:AuthService = inject(AuthService);
  router:Router=inject(Router);
  toastrService:ToastrService=inject(ToastrService);

  passwordValidation:any=/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
  loading:boolean = false;
  errorMessage!:string;
  subscription:Subscription = new Subscription();

  changePasswordForm:FormGroup = new FormGroup({
    currentPassword:new FormControl(null,[Validators.required,Validators.pattern(this.passwordValidation)]),
    password: new FormControl(null,[Validators.required,Validators.pattern(this.passwordValidation)]),
    rePassword: new FormControl(null,[Validators.required,Validators.pattern(this.passwordValidation)]),
  },this.confirmPassword);

  // Custom Validation (compare between password and repassword)
  confirmPassword(control:AbstractControl){
    if(control.get('password')?.value===control.get('rePassword')?.value){
      return null
    }
    else{
      return {'mismatched':true};
    }
  }

  // Change password function
  changePassword(){
    if(this.changePasswordForm.valid){
      this.loading = true;
      const changePasswordSub =  this.authService.changePassword(this.changePasswordForm.value).subscribe({
        next:(res)=>{
          if(res.message==='success'){
            localStorage.removeItem("userToken");
            this.authService.userData.next(null);
            this.loading = false;
            this.router.navigate(['/logIn']);
            this.toastrService.success('Your password is successfully changed , please log in.','Authentication');
          }
        },
        error:(err)=>{
          this.loading = false;
          this.errorMessage = err.message
        }
      })
      this.subscription.add(changePasswordSub);
    }
  }

  ngOnDestroy(): void {
    // unsubscribe subscription
    this.subscription.unsubscribe();
  }
}