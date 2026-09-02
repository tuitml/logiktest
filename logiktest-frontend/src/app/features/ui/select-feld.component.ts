import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import type { SelectOption } from '../../core/engine';
import { FeldWrapperBasis } from './feld-wrapper.basis';

/**
 * Auswahl-Feld-Wrapper um `<s-select>` + `<s-menu-item>` (typ `select`).
 * Wert und Optionen kommen im selben `view()`-Objekt -> immer konsistent.
 */
@Component({
  selector: 'app-select-feld',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    @if (view().sichtbar) {
      <div class="feld-zelle">
        <s-select
          [value]="stringify(view().wert)"
          placeholder="Bitte auswählen"
          [disabled]="!view().bearbeitbar"
          [severity]="hatFehler() ? 'critical' : 'none'"
          (sChange)="onChange($any($event))"
        >
          @for (option of view().optionen; track option.label) {
            <s-menu-item
              [value]="stringify(option.wert)"
              [label]="option.label"
              s-role="option"
            ></s-menu-item>
          }
          <span slot="label">{{ view().label }}</span>
        </s-select>

        @if (hatFehler()) {
          <p class="feld-fehler">{{ view().fehler[0] }}</p>
        }
      </div>
    }
  `,
})
export class SelectFeldComponent extends FeldWrapperBasis {
  /** `s-select` liefert `CustomEvent<string[]>` – hier einwertig, zurückgemappt auf den echten Options-Wert. */
  protected onChange(ereignis: CustomEvent<string[]>): void {
    const roh = ereignis.detail?.[0] ?? '';
    const treffer = this.view().optionen.find(
      (o: SelectOption) => this.stringify(o.wert) === roh,
    );
    this.wertGeaendert.emit(treffer ? treffer.wert : undefined);
  }
}
