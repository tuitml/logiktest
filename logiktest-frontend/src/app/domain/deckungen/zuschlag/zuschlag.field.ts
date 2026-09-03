import { STEUERUNG_AN } from '../../../core/engine';
import type { FieldModule } from '../../../core/engine';
import type { DeckungContext } from '../deckung.context';

/** Zuschlag in Prozent (optional). */
export const zuschlagField: FieldModule<number, DeckungContext> = {
  id: 'zuschlag',
  label: 'Zuschlag (%)',
  type: 'zahl',
  dependencies: [],
  steuerung: () => STEUERUNG_AN,
  validierung: (ctx) => {
    const value = ctx.value<number>('zuschlag');
    if (value == null) {
      return [];
    }
    return value < 0 || value > 100 ? ['Zuschlag muss zwischen 0 und 100 liegen.'] : [];
  },
};
