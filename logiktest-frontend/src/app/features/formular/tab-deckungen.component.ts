import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DeckungStore } from '../../domain/deckungen/deckung.store';
import { DeckungKarteComponent } from './deckungen/deckung-karte.component';

@Component({
  selector: 'app-tab-deckungen',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DeckungKarteComponent],
  template: `
    <h2 class="tab-ueberschrift">Deckungen</h2>

    @for (deckung of store.deckungen(); track deckung.id; let i = $index) {
      <app-deckung-karte [deckung]="deckung" [position]="i + 1" />
    }

    <button
      type="button"
      class="hinzufuegen"
      [disabled]="!store.kannHinzufuegen()"
      (click)="store.hinzufuegen()"
    >
      + Deckung hinzufügen
    </button>
  `,
  styles: `
    .hinzufuegen {
      background: #1f6f8b;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 0.6rem 1.2rem;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .hinzufuegen:disabled {
      background: #8fa9b3;
      cursor: not-allowed;
    }
  `,
})
export class TabDeckungenComponent {
  protected readonly store = inject(DeckungStore);
}
