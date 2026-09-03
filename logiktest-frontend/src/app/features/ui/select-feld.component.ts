import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  viewChild,
} from '@angular/core';

import type { SelectOption } from '../../core/engine';
import { FeldWrapperBasis } from './feld-wrapper.basis';

type SSelectEl = HTMLElement & { value?: unknown };

/**
 * Auswahl-Feld-Wrapper um `<s-select>` + `<s-menu-item>` (typ `select`).
 * Wert und Optionen kommen im selben `view()`-Objekt -> immer konsistent.
 *
 * `value` wird NICHT per Binding gesetzt: `s-select` löst `value` gegen seine
 * `<s-menu-item>`-Kinder auf. Wechseln die Optionen im selben Render-Durchlauf
 * (z. B. bei Import), sind die neuen `<s-menu-item>` von Stencil noch nicht
 * hydriert und der Wert würde verworfen. Deshalb setzen wir `value` nach dem
 * Render und wiederholen kurz, bis er "hält".
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
          #sel
          placeholder="Bitte auswählen"
          [disabled]="!view().bearbeitbar"
          [severity]="hatFehler() ? 'critical' : 'none'"
          (sChange)="onChange($any($event))"
        >
          @for (option of view().optionen; track option.wert) {
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
  private readonly selectEl = viewChild<ElementRef<SSelectEl>>('sel');

  constructor() {
    super();
    afterRenderEffect(() => {
      const el = this.selectEl()?.nativeElement;
      if (el) {
        this.synchronisiereWert(el, this.stringify(this.view().wert), 0);
      }
    });
  }

  private synchronisiereWert(el: SSelectEl, soll: string, versuch: number): void {
    const ist = Array.isArray(el.value) ? el.value[0] : el.value;
    if (String(ist ?? '') === soll) {
      return;
    }
    el.value = soll;
    if (versuch < 8) {
      setTimeout(() => this.synchronisiereWert(el, soll, versuch + 1), 25);
    }
  }

  /** `s-select` liefert `CustomEvent<string[]>` – hier einwertig, zurückgemappt auf den echten Options-Wert. */
  protected onChange(ereignis: CustomEvent<string[]>): void {
    const roh = ereignis.detail?.[0] ?? '';
    const treffer = this.view().optionen.find(
      (o: SelectOption) => this.stringify(o.wert) === roh,
    );
    this.wertGeaendert.emit(treffer ? treffer.wert : undefined);
  }
}
