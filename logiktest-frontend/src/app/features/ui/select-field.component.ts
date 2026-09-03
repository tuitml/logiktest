import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  viewChild,
} from '@angular/core';

import type { SelectOption } from '../../core/engine';
import { FieldWrapperBase } from './field-wrapper.base';

type SSelectEl = HTMLElement & { value?: unknown };

/**
 * Auswahl-Feld-Wrapper um `<s-select>` + `<s-menu-item>` (type `select`).
 * Wert und Optionen kommen im selben `view()`-Objekt -> immer konsistent.
 *
 * `value` wird NICHT per Binding gesetzt: `s-select` löst `value` gegen seine
 * `<s-menu-item>`-Kinder auf. Wechseln die Optionen im selben Render-Durchlauf
 * (z. B. bei Import), sind die neuen `<s-menu-item>` von Stencil noch nicht
 * hydriert und der Wert würde verworfen. Deshalb setzen wir `value` nach dem
 * Render und wiederholen kurz, bis er "hält".
 */
@Component({
  selector: 'app-select-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    @if (view().sichtbar) {
      <div class="field-cell">
        <s-select
          #sel
          placeholder="Bitte auswählen"
          [disabled]="!view().bearbeitbar"
          [severity]="hasError() ? 'critical' : 'none'"
          (sChange)="onChange($any($event))"
        >
          @for (option of view().options; track option.value) {
            <s-menu-item
              [value]="stringify(option.value)"
              [label]="option.label"
              s-role="option"
            ></s-menu-item>
          }
          <span slot="label">{{ view().label }}</span>
        </s-select>

        @if (hasError()) {
          <p class="field-error">{{ view().errors[0] }}</p>
        }
      </div>
    }
  `,
})
export class SelectFieldComponent extends FieldWrapperBase {
  private readonly selectEl = viewChild<ElementRef<SSelectEl>>('sel');

  constructor() {
    super();
    afterRenderEffect(() => {
      const el = this.selectEl()?.nativeElement;
      if (el) {
        this.syncValue(el, this.stringify(this.view().value), 0);
      }
    });
  }

  private syncValue(el: SSelectEl, target: string, attempt: number): void {
    const current = Array.isArray(el.value) ? el.value[0] : el.value;
    if (String(current ?? '') === target) {
      return;
    }
    el.value = target;
    if (attempt < 8) {
      setTimeout(() => this.syncValue(el, target, attempt + 1), 25);
    }
  }

  /** `s-select` liefert `CustomEvent<string[]>` – hier einwertig, zurückgemappt auf den echten Options-Wert. */
  protected onChange(event: CustomEvent<string[]>): void {
    const raw = event.detail?.[0] ?? '';
    const match = this.view().options.find((o: SelectOption) => this.stringify(o.value) === raw);
    this.valueChange.emit(match ? match.value : undefined);
  }
}
