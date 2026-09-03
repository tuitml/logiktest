import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { SelectFieldComponent } from '../../ui/select-field.component';
import { TextFieldComponent } from '../../ui/text-field.component';
import { DeckungStore } from '../../../domain/deckungen/deckung.store';
import type { DeckungRuntime } from '../../../domain/deckungen/deckung.runtime';
import { FahrzeugRowComponent } from './fahrzeug-row.component';
import { GrundstueckCardComponent } from './grundstueck-card.component';

@Component({
  selector: 'app-deckung-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectFieldComponent, TextFieldComponent, FahrzeugRowComponent, GrundstueckCardComponent],
  templateUrl: './deckung-card.component.html',
  styleUrl: './deckung-card.component.css',
})
export class DeckungCardComponent {
  protected readonly store = inject(DeckungStore);

  readonly deckung = input.required<DeckungRuntime>();
  readonly position = input.required<number>();

  protected changeField(id: 'risikoart' | 'rabatt' | 'zuschlag', value: unknown): void {
    this.store.changeField(this.deckung(), id, value);
  }
}
