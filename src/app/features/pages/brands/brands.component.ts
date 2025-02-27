import { BrandsService } from './../../../core/services/e-comme/brands/brands.service';
import { Component, DoCheck, inject, OnDestroy, OnInit } from '@angular/core';
import { SecondCardComponent } from "../../../shared/components/second-card/second-card.component";
import { Subscription } from 'rxjs';
import { Ibrand } from '../../../shared/interfaces/brand/brand';

@Component({
  selector: 'app-brands',
  imports: [SecondCardComponent],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit,DoCheck,OnDestroy{
  modalEmitter!:boolean; // emitter come from child component.
  bIdEmitter!:string; // emitter come from child component.
  modal:boolean = false; // Modal Flag
  modalImage!:string;
  brands!:Ibrand[];
  getBrandsSubscription!:Subscription;
  getSpecificBrandsSubscription!:Subscription;
  // Inject BrandsService
  brandsService:BrandsService = inject(BrandsService);
  //Get All Brands
  getBrands(){
    this.getBrandsSubscription = this.brandsService.getAllBrands().subscribe({
      next:(res)=>{
        this.brands = res.data;
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }
  // Get specific brand
  getBrand(){
    this.modalEmitter= false;
    this.brands.forEach((brand)=>{
      if(brand._id===this.bIdEmitter){
        this.modalImage = brand.image;
      }
    });
  }
  // close modal method.
  closeModal(){
    this.modalImage = "";
    this.modal = false;
  }
  ngOnInit(): void {
    this.getBrands();
  }
  ngDoCheck(): void {
    if(this.modalEmitter===true){
      this.modal = true;
      this.getBrand();
    }
  }
  ngOnDestroy(): void {
    // unsubscribe getBrandsSubscription and getSpecificBrandsSubscription.
    this.getBrandsSubscription.unsubscribe();
    if(this.getSpecificBrandsSubscription){
      this.getSpecificBrandsSubscription.unsubscribe();
    }
  }
}
