import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SelectFieldComponent } from '../../../features/ui/select-field.component';
import { SELECT_FIELD_TEMPLATE, VertragsdatenFieldBase } from '../../../features/ui/vertragsdaten-field.base';

@Component({
  selector: 'app-preisstand-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectFieldComponent],
  template: SELECT_FIELD_TEMPLATE,
})
export class PreisstandFieldComponent extends VertragsdatenFieldBase {
  protected readonly fieldId = 'preisstand';
}
