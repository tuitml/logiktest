import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  output,
} from '@angular/core';

import type { FeldView, SelectOption } from '../../core/engine';

/**
 * Geteilte Darstellung eines Feldes: bindet genau EIN `FeldView`-Objekt an die
 * HUK-Shield-Web-Components (`s-text-field` / `s-select`). Unsichtbare Felder
 * erzeugen KEIN Element -> im 2-Spalten-Grid rückt das nächste Feld nach
 * (Host = `display:contents`).
 *
 * Alle abgeleiteten Werte kommen aus demselben eingefrorenen `view()`-Objekt,
 * die Web Component bekommt also nie einen halbfertigen Zustand.
 */
@Component({
  selector: 'app-feld-host',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: { class: 'feld-slot' },
  template: `
    @if (view().sichtbar) {
      <div class="feld-zelle">
        @if (view().typ === 'select') {
          <s-select
            [value]="selectWert()"
            placeholder="Bitte auswählen"
            [disabled]="!view().bearbeitbar"
            [severity]="hatFehler() ? 'critical' : 'none'"
            (sChange)="onSelectChange($any($event))"
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
        } @else {
          <s-text-field
            [value]="view().wert ?? ''"
            full-width="true"
            [input-type]="view().typ === 'zahl' ? 'number' : 'text'"
            [disabled]="!view().bearbeitbar"
            [severity]="hatFehler() ? 'critical' : 'none'"
            (sChange)="onTextChange($any($event))"
          >
            <span slot="label">{{ view().label }}</span>
          </s-text-field>
        }

        @if (hatFehler()) {
          <p class="feld-fehler">{{ view().fehler[0] }}</p>
        } @else if (view().pruefungLaeuft) {
          <p class="feld-hinweis">Prüfung läuft…</p>
        }
      </div>
    }
  `,
  styles: `
    .feld-zelle {
      min-width: 0;
    }
    .feld-fehler {
      margin: 0.25rem 0 0;
      color: var(--s-color-critical, #b23b3b);
      font-size: 0.8rem;
    }
    .feld-hinweis {
      margin: 0.25rem 0 0;
      color: #4a6572;
      font-size: 0.8rem;
    }
  `,
})
export class FeldHostComponent {
  readonly view = input.required<FeldView>();
  readonly wertGeaendert = output<unknown>();

  protected readonly hatFehler = computed(() => this.view().fehler.length > 0);
  protected readonly selectWert = computed(() => this.stringify(this.view().wert));

  protected stringify(wert: unknown): string {
    return wert == null ? '' : String(wert);
  }

  /** s-text-field: CustomEvent<string> */
  protected onTextChange(ereignis: CustomEvent<string>): void {
    const roh = ereignis.detail ?? '';
    const wert = roh === '' ? undefined : this.view().typ === 'zahl' ? Number(roh) : roh;
    this.wertGeaendert.emit(wert);
  }

  /** s-select: CustomEvent<string[]> – ausgewählte Werte, hier einwertig. */
  protected onSelectChange(ereignis: CustomEvent<string[]>): void {
    const roh = ereignis.detail?.[0] ?? '';
    const treffer = this.view().optionen.find(
      (o: SelectOption) => this.stringify(o.wert) === roh,
    );
    this.wertGeaendert.emit(treffer ? treffer.wert : undefined);
  }
}
