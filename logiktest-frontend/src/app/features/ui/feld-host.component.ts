import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';

import type { FeldView } from '../../core/engine';

/**
 * Geteilte Darstellung eines Feldes: eine Grid-Zelle mit der passenden
 * Web Component. Unsichtbare Felder erzeugen KEINE Zelle -> das nächste Feld
 * rückt im 2-Spalten-Grid automatisch nach.
 *
 * Timing-Behandlung (1 Render pro Änderung, Wert + Optionen gemeinsam) steckt
 * komplett in den Web Components; hier wird nur das `FeldView`-Signal
 * durchgereicht.
 */
@Component({
  selector: 'app-feld-host',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // display:contents -> der Host belegt selbst KEINE Grid-Zelle; nur die
  // gerenderte .feld-zelle zählt. Unsichtbare Felder verschwinden damit komplett
  // aus dem Grid und die folgenden Felder rücken nach.
  host: { class: 'feld-slot' },
  template: `
    @if (view().sichtbar) {
      <div class="feld-zelle">
        @if (view().typ === 'select') {
          <ds-select [feld]="view()" (wertGeaendert)="aufWert($event)"></ds-select>
        } @else {
          <ds-input [feld]="view()" (wertGeaendert)="aufWert($event)"></ds-input>
        }
      </div>
    }
  `,
  styles: `
    .feld-zelle {
      min-width: 0;
    }
  `,
})
export class FeldHostComponent {
  readonly view = input.required<FeldView>();
  readonly wertGeaendert = output<unknown>();

  aufWert(ereignis: Event): void {
    this.wertGeaendert.emit((ereignis as CustomEvent).detail);
  }
}
