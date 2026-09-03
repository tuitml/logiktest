import { STEUERUNG_AN } from '../../../core/engine';
import type { FieldModule } from '../../../core/engine';
import type { DeckungContext } from '../deckung.context';

/** Rabatt in Prozent (optional). */
export const rabattField: FieldModule<number, DeckungContext> = {
  id: 'rabatt',
  label: 'Rabatt (%)',
  type: 'zahl',
  dependencies: [],
  steuerung: () => STEUERUNG_AN,
  validierung: (ctx) => {
    const value = ctx.value<number>('rabatt');
    if (value == null) {
      return [];
    }
    return value < 0 || value > 100 ? ['Rabatt muss zwischen 0 und 100 liegen.'] : [];
  },
};
