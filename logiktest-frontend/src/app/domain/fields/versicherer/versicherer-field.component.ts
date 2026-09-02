import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FeldHostComponent } from '../../../features/ui/feld-host.component';
import { FELD_TEMPLATE, VertragsdatenFeldBasis } from '../../../features/ui/vertragsdaten-feld.basis';

/**
 * Das Feld "Versicherer" gehört zu keinem Tab – es steht in der Kopfzeile der
 * Anwendung. Technisch ist es aber ein ganz normales Feld im selben Store.
 */
@Component({
  selector: 'app-versicherer-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FeldHostComponent],
  template: FELD_TEMPLATE,
})
export class VersichererFieldComponent extends VertragsdatenFeldBasis {
  protected readonly feldId = 'versicherer';
}
