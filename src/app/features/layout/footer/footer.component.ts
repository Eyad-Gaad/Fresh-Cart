import { Component } from '@angular/core';
import { ExternalAnchorDirective } from '../../../shared/directive/externalAnchor/external-anchor.directive';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [ExternalAnchorDirective,TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
