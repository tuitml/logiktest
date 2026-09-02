import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FeldHostComponent } from '../../../features/ui/feld-host.component';
import { FELD_TEMPLATE, VertragsdatenFeldBasis } from '../../../features/ui/vertragsdaten-feld.basis';

@Component({
  selector: 'app-sb-staffel-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FeldHostComponent],
  template: FELD_TEMPLATE,
})
export class SbStaffelFieldComponent extends VertragsdatenFeldBasis {
  protected readonly feldId = 'sbStaffel';
}
