import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FeldWrapperBasis } from './feld-wrapper.basis';

/**
 * Textueller Feld-Wrapper um `<s-text-field>` (typ `text` und `zahl`).
 * Bekommt genau EIN `view()`-Objekt; rendert nichts bei `!view().sichtbar`.
 */
@Component({
  selector: 'app-text-feld',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    @if (view().sichtbar) {
      <div class="feld-zelle">
        <s-text-field
          [value]="view().wert ?? ''"
          full-width="true"
          [input-type]="view().typ === 'zahl' ? 'number' : 'text'"
          [disabled]="!view().bearbeitbar"
          [severity]="hatFehler() ? 'critical' : 'none'"
          (sChange)="onChange($any($event))"
        >
          <span slot="label">{{ view().label }}</span>
        </s-text-field>

        @if (hatFehler()) {
          <p class="feld-fehler">{{ view().fehler[0] }}</p>
        } @else if (view().pruefungLaeuft) {
          <p class="feld-hinweis">Prüfung läuft…</p>
        }
      </div>
    }
  `,
})
export class TextFeldComponent extends FeldWrapperBasis {
  /** `s-text-field` liefert `CustomEvent<string>`. */
  protected onChange(ereignis: CustomEvent<string>): void {
    const roh = ereignis.detail ?? '';
    const wert = roh === '' ? undefined : this.view().typ === 'zahl' ? Number(roh) : roh;
    this.wertGeaendert.emit(wert);
  }
}
