import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { SelectFeldComponent } from '../../ui/select-feld.component';
import { TextFeldComponent } from '../../ui/text-feld.component';
import { DeckungStore } from '../../../domain/deckungen/deckung.store';
import type { DeckungRuntime } from '../../../domain/deckungen/deckung.runtime';
import { FahrzeugZeileComponent } from './fahrzeug-zeile.component';
import { GrundstueckKarteComponent } from './grundstueck-karte.component';

@Component({
  selector: 'app-deckung-karte',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectFeldComponent, TextFeldComponent, FahrzeugZeileComponent, GrundstueckKarteComponent],
  templateUrl: './deckung-karte.component.html',
  styleUrl: './deckung-karte.component.css',
})
export class DeckungKarteComponent {
  protected readonly store = inject(DeckungStore);

  readonly deckung = input.required<DeckungRuntime>();
  readonly position = input.required<number>();

  protected feldGeaendert(id: 'risikoart' | 'rabatt' | 'zuschlag', wert: unknown): void {
    this.store.aendereFeld(this.deckung(), id, wert);
  }
}
