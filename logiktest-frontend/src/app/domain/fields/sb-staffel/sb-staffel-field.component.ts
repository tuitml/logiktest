import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SelectFieldComponent } from '../../../features/ui/select-field.component';
import { SELECT_FIELD_TEMPLATE, VertragsdatenFieldBase } from '../../../features/ui/vertragsdaten-field.base';

@Component({
  selector: 'app-sb-staffel-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectFieldComponent],
  template: SELECT_FIELD_TEMPLATE,
})
export class SbStaffelFieldComponent extends VertragsdatenFieldBase {
  protected readonly fieldId = 'sbStaffel';
}
