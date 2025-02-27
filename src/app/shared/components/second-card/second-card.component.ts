import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ibrand } from '../../interfaces/brand/brand';

@Component({
  selector: 'app-second-card',
  imports: [],
  templateUrl: './second-card.component.html',
  styleUrl: './second-card.component.scss'
})
export class SecondCardComponent {
  // Required brand input.
  @Input({required:true}) brand!:Ibrand;
  // Output modalEmitter , bId emitter.
  @Output() modalEmitter:EventEmitter<boolean> = new EventEmitter();
  @Output() bIdEmitter:EventEmitter<string> = new EventEmitter();
  modal(){
    this.modalEmitter.emit(true);
    this.bIdEmitter.emit(this.brand._id);
  }
}
