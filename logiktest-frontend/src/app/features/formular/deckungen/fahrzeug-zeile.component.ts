import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SelectFeldComponent } from '../../ui/select-feld.component';
import type { DeckungRuntime, FahrzeugRuntime } from '../../../domain/deckungen/deckung.runtime';
import type { Wagniskennziffer } from '../../../domain/deckungen/deckung.typen';

@Component({
  selector: 'app-fahrzeug-zeile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectFeldComponent],
  template: `
    <div class="unterzeile">
      <span class="unterzeile-titel">Fahrzeug {{ position() }}</span>
      <app-select-feld
        [view]="fahrzeug().wagniskennzifferView()"
        (wertGeaendert)="aendern($event)"
      />
      @if (deckung().darfFahrzeugEntfernen()) {
        <button type="button" class="entfernen" (click)="deckung().fahrzeugEntfernen(fahrzeug())">
          Entfernen
        </button>
      }
    </div>
  `,
})
export class FahrzeugZeileComponent {
  readonly deckung = input.required<DeckungRuntime>();
  readonly fahrzeug = input.required<FahrzeugRuntime>();
  readonly position = input.required<number>();

  protected aendern(wert: unknown): void {
    this.fahrzeug().setzeWagniskennziffer(wert as Wagniskennziffer | undefined);
  }
}
