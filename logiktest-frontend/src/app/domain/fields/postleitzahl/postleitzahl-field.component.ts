import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TextFeldComponent } from '../../../features/ui/text-feld.component';
import { TEXT_FELD_TEMPLATE, VertragsdatenFeldBasis } from '../../../features/ui/vertragsdaten-feld.basis';

@Component({
  selector: 'app-postleitzahl-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextFeldComponent],
  template: TEXT_FELD_TEMPLATE,
})
export class PostleitzahlFieldComponent extends VertragsdatenFeldBasis {
  protected readonly feldId = 'postleitzahl';
}
