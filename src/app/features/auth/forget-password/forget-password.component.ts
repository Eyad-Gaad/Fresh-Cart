import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../../core/services/auth/auth.service';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule,AlertComponent],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent implements OnDestroy{
  display:number = 0;
  forgetPasswordLoading:boolean = false;
  resetCodeLoading:boolean = false;
  resetPasswordLoading:boolean = false;
  forgetPasswordSubscription!:Subscription;
  resetCodeSubscription!:Subscription;
  resetPasswordSubscription!:Subscription;
  // Inject AuthService , ToastrService and Router service.
  authService:AuthService = inject(AuthService);
  router:Router = inject(Router);
  toastrService:ToastrService = inject(ToastrService);
  // forget password form object.
  forgetPasswordForm:FormGroup = new FormGroup({
    email:new FormControl(null,[Validators.required,Validators.email])
  });
  // reset code form object.
  resetCodeForm:FormGroup = new FormGroup({
    num1:new FormControl(null,[Validators.required,Validators.pattern(/^\d{1}$/)]),
    num2:new FormControl(null,[Validators.required,Validators.pattern(/^\d{1}$/)]),
    num3:new FormControl(null,[Validators.required,Validators.pattern(/^\d{1}$/)]),
    num4:new FormControl(null,[Validators.required,Validators.pattern(/^\d{1}$/)]),
    num5:new FormControl(null,[Validators.required,Validators.pattern(/^\d{1}$/)]),
    num6:new FormControl(null,[Validators.required,Validators.pattern(/^\d{1}$/)]),
  });
  // reset password form object.
  resetPasswordForm:FormGroup = new FormGroup({
      email:new FormControl(null,[Validators.required,Validators.email]),
      newPassword : new FormControl(null,[Validators.required,Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/)])
  });
  // forgetPassword method.
  forgetPassword(){
    if(this.forgetPasswordForm.valid){
      this.forgetPasswordLoading = true;
      this.forgetPasswordSubscription = this.authService.forgetPassword(this.forgetPasswordForm.value).subscribe({
        next:(res)=>{
          this.display = 1;
          this.forgetPasswordLoading = false;
          this.resetPasswordForm.get('email')?.patchValue(this.forgetPasswordForm.get('email')?.value);
        },
        error:(err)=>{
          this.forgetPasswordLoading = false;
          this.toastrService.error(`${err.error.message} !`,`Authentication`);
          this.router.navigate([`/signUp`]);
        }
      });
    }
  }
  // resetCode method.
  resetCode(){
    if(this.resetCodeForm.valid){
      this.resetCodeLoading = true;
      this.resetCodeSubscription = this.authService.verifyResetCode(`${this.resetCodeForm.get('num1')?.value}${this.resetCodeForm.get('num2')?.value}${this.resetCodeForm.get('num3')?.value}${this.resetCodeForm.get('num4')?.value}${this.resetCodeForm.get('num5')?.value}${this.resetCodeForm.get('num6')?.value}`).subscribe({
        next:(res)=>{
          this.resetCodeLoading = false;
          this.display = 2;
        },
        error:(err)=>{
          this.resetCodeLoading = false;
          this.toastrService.error(`${err.error.message} !`,`Authentication`);
        }
      });
    }
  }
  // resetPassword method.
  resetPassword(){
      if(this.resetPasswordForm.valid){
        this.resetPasswordLoading = true;
        this.resetPasswordSubscription = this.authService.resetPassword(this.resetPasswordForm.value).subscribe({
          next:(res)=>{
            this.resetPasswordLoading = false;
            this.toastrService.success(`Now you have a new password , LogIn Now`,`Authentication`);
            this.router.navigate([`/logIn`]);
          },
          error:(err)=>{
            this.resetPasswordLoading = false;
            this.toastrService.error(`${err.error.message}`,`Authentication`);
          }
        });
      }
  }
  ngOnDestroy(): void {
    // unsubscribe forgetPasswordSubscription , resetCodeSubscription and resetPasswordSubscription.
    if(this.forgetPasswordSubscription){
      this.forgetPasswordSubscription.unsubscribe();
    }
    if(this.resetCodeSubscription){
      this.resetCodeSubscription.unsubscribe();
    }
    if(this.resetPasswordSubscription){
      this.resetPasswordSubscription.unsubscribe();
    }
  }
}
