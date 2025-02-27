import { Routes } from '@angular/router';
import { HomeComponent } from './features/pages/home/home.component';
import { CartComponent } from './features/pages/cart/cart.component';
import { ProductsComponent } from './features/pages/products/products.component';
import { CategoriesComponent } from './features/pages/categories/categories.component';
import { BrandsComponent } from './features/pages/brands/brands.component';
import { LogInComponent } from './features/auth/log-in/log-in.component';
import { SignUpComponent } from './features/auth/sign-up/sign-up.component';
import { NotFoundComponent } from './features/layout/not-found/not-found.component';
import { authGuard } from './core/guards/auth/auth.guard';
import { ProductDetailsComponent } from './features/pages/product-details/product-details.component';
import { WishListComponent } from './features/pages/wish-list/wish-list.component';
import { OrderComponent } from './features/pages/order/order.component';
import { AllOrdersComponent } from './features/pages/all-orders/all-orders.component';
import { ForgetPasswordComponent } from './features/auth/forget-password/forget-password.component';

export const routes: Routes = [
    {path:'',redirectTo:'home',pathMatch:"full"},
    {path:'signUp',component:SignUpComponent,title:'signUp'},
    {path:'logIn',component:LogInComponent,title:'logIn'},
    {path:'forget-password',component:ForgetPasswordComponent,title:'forget-password'},
    {path:'home',component:HomeComponent,title:'home',canActivate:[authGuard]},
    {path:'cart',component:CartComponent,title:'cart',canActivate:[authGuard]},
    {path:'wishList',component:WishListComponent,title:'wishList',canActivate:[authGuard]},
    {path:'products',component:ProductsComponent,title:'products',canActivate:[authGuard]},
    {path:'product-Details/:id',component:ProductDetailsComponent,title:'product-Details',canActivate:[authGuard]},
    {path:'categories',component:CategoriesComponent,title:'categories',canActivate:[authGuard]},
    {path:'brands',component:BrandsComponent,title:'brands',canActivate:[authGuard]},
    {path:'order/:cId',component:OrderComponent,title:'order',canActivate:[authGuard]},
    {path:'allorders',component:AllOrdersComponent,title:'allorders',canActivate:[authGuard]},
    {path:'**',component:NotFoundComponent,title:'page not found',canActivate:[authGuard]}
];
