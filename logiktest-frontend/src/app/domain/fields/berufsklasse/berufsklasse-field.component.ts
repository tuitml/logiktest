import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FeldHostComponent } from '../../../features/ui/feld-host.component';
import { FELD_TEMPLATE, VertragsdatenFeldBasis } from '../../../features/ui/vertragsdaten-feld.basis';

@Component({
  selector: 'app-berufsklasse-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FeldHostComponent],
  template: FELD_TEMPLATE,
})
export class BerufsklasseFieldComponent extends VertragsdatenFeldBasis {
  protected readonly feldId = 'berufsklasse';
}
