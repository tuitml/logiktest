import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FieldWrapperBase } from './field-wrapper.base';

/**
 * Textueller Feld-Wrapper um `<s-text-field>` (type `text` und `zahl`).
 * Bekommt genau EIN `view()`-Objekt; rendert nichts bei `!view().sichtbar`.
 */
@Component({
  selector: 'app-text-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    @if (view().sichtbar) {
      <div class="field-cell">
        <s-text-field
          [value]="view().value ?? ''"
          full-width="true"
          [input-type]="view().type === 'zahl' ? 'number' : 'text'"
          [disabled]="!view().bearbeitbar"
          [severity]="hasError() ? 'critical' : 'none'"
          (sChange)="onChange($any($event))"
        >
          <span slot="label">{{ view().label }}</span>
        </s-text-field>

        @if (hasError()) {
          <p class="field-error">{{ view().errors[0] }}</p>
        } @else if (view().checking) {
          <p class="field-hint">Prüfung läuft…</p>
        }
      </div>
    }
  `,
})
export class TextFieldComponent extends FieldWrapperBase {
  /** `s-text-field` liefert `CustomEvent<string>`. */
  protected onChange(event: CustomEvent<string>): void {
    const raw = event.detail ?? '';
    const value = raw === '' ? undefined : this.view().type === 'zahl' ? Number(raw) : raw;
    this.valueChange.emit(value);
  }
}
