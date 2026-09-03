import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TextFieldComponent } from '../../../features/ui/text-field.component';
import { TEXT_FIELD_TEMPLATE, VertragsdatenFieldBase } from '../../../features/ui/vertragsdaten-field.base';

@Component({
  selector: 'app-postleitzahl-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextFieldComponent],
  template: TEXT_FIELD_TEMPLATE,
})
export class PostleitzahlFieldComponent extends VertragsdatenFieldBase {
  protected readonly fieldId = 'postleitzahl';
}
