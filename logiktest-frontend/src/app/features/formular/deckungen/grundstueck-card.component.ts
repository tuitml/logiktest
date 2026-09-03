import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type {
  DeckungRuntime,
  GrundstueckRuntime,
} from '../../../domain/deckungen/deckung.runtime';
import type { RisikoartId } from '../../../domain/deckungen/deckung.types';
import { NutzungRowComponent } from './nutzung-row.component';

@Component({
  selector: 'app-grundstueck-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NutzungRowComponent],
  template: `
    <div class="subcard">
      <div class="subcard-head">
        <strong>Grundstück {{ position() }}</strong>
        @if (deckung().canRemoveGrundstueck()) {
          <button type="button" class="remove" (click)="deckung().removeGrundstueck(grundstueck())">
            Grundstück entfernen
          </button>
        }
      </div>

      @for (nutzung of grundstueck().nutzungen(); track nutzung.id; let i = $index) {
        <app-nutzung-row
          [grundstueck]="grundstueck()"
          [nutzung]="nutzung"
          [position]="i + 1"
          [risikoart]="risikoart()"
        />
      }

      <button type="button" class="add small" (click)="grundstueck().addNutzung()">
        + Nutzung hinzufügen
      </button>
    </div>
  `,
})
export class GrundstueckCardComponent {
  readonly deckung = input.required<DeckungRuntime>();
  readonly grundstueck = input.required<GrundstueckRuntime>();
  readonly position = input.required<number>();
  readonly risikoart = input.required<RisikoartId | undefined>();
}
