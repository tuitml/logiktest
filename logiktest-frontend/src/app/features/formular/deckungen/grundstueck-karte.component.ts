import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type {
  DeckungRuntime,
  GrundstueckRuntime,
} from '../../../domain/deckungen/deckung.runtime';
import type { RisikoartId } from '../../../domain/deckungen/deckung.typen';
import { NutzungZeileComponent } from './nutzung-zeile.component';

@Component({
  selector: 'app-grundstueck-karte',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NutzungZeileComponent],
  template: `
    <div class="unterkarte">
      <div class="unterkarte-kopf">
        <strong>Grundstück {{ position() }}</strong>
        @if (deckung().darfGrundstueckEntfernen()) {
          <button
            type="button"
            class="entfernen"
            (click)="deckung().grundstueckEntfernen(grundstueck())"
          >
            Grundstück entfernen
          </button>
        }
      </div>

      @for (nutzung of grundstueck().nutzungen(); track nutzung.id; let i = $index) {
        <app-nutzung-zeile
          [grundstueck]="grundstueck()"
          [nutzung]="nutzung"
          [position]="i + 1"
          [risikoart]="risikoart()"
        />
      }

      <button type="button" class="hinzufuegen klein" (click)="grundstueck().nutzungHinzufuegen()">
        + Nutzung hinzufügen
      </button>
    </div>
  `,
})
export class GrundstueckKarteComponent {
  readonly deckung = input.required<DeckungRuntime>();
  readonly grundstueck = input.required<GrundstueckRuntime>();
  readonly position = input.required<number>();
  readonly risikoart = input.required<RisikoartId | undefined>();
}
