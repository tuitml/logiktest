import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SelectFeldComponent } from '../../../features/ui/select-feld.component';
import { SELECT_FELD_TEMPLATE, VertragsdatenFeldBasis } from '../../../features/ui/vertragsdaten-feld.basis';

@Component({
  selector: 'app-preisstand-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectFeldComponent],
  template: SELECT_FELD_TEMPLATE,
})
export class PreisstandFieldComponent extends VertragsdatenFeldBasis {
  protected readonly feldId = 'preisstand';
}
