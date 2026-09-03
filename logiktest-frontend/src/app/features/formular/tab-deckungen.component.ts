import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DeckungStore } from '../../domain/deckungen/deckung.store';
import { DeckungCardComponent } from './deckungen/deckung-card.component';

@Component({
  selector: 'app-tab-deckungen',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DeckungCardComponent],
  template: `
    <h2 class="tab-heading">Deckungen</h2>

    @for (deckung of store.deckungen(); track deckung.id; let i = $index) {
      <app-deckung-card [deckung]="deckung" [position]="i + 1" />
    }

    <button type="button" class="add" [disabled]="!store.canAdd()" (click)="store.add()">
      + Deckung hinzufügen
    </button>
  `,
  styles: `
    .add {
      background: #1f6f8b;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 0.6rem 1.2rem;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .add:disabled {
      background: #8fa9b3;
      cursor: not-allowed;
    }
  `,
})
export class TabDeckungenComponent {
  protected readonly store = inject(DeckungStore);
}
