import { computed, Directive, input, output } from '@angular/core';

import type { FieldView } from '../../core/engine';

/**
 * Gemeinsame Basis für `TextFieldComponent` und `SelectFieldComponent`:
 * beide binden genau EIN `view()`-Objekt und melden Änderungen über
 * `valueChange`. `display:contents` am Host (`.field-slot`) sorgt dafür, dass
 * ein unsichtbares Feld keine Grid-Zelle belegt.
 */
@Directive({ host: { class: 'field-slot' } })
export abstract class FieldWrapperBase {
  readonly view = input.required<FieldView>();
  readonly valueChange = output<unknown>();

  protected readonly hasError = computed(() => this.view().errors.length > 0);

  protected stringify(value: unknown): string {
    return value == null ? '' : String(value);
  }
}
