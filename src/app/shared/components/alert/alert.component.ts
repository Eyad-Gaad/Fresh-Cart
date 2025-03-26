import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-alert',
  imports: [TranslatePipe],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  // Input alertType and alertMessage from parent comonent.
  @Input() alertType!:string;
  @Input() alertMessage!:string;
}
