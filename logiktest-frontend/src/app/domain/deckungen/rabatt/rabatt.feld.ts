import { STEUERUNG_AN } from '../../../core/engine';
import type { FeldModul } from '../../../core/engine';
import type { DeckungKontext } from '../deckung.kontext';

/** Rabatt in Prozent (optional). */
export const rabattFeld: FeldModul<number, DeckungKontext> = {
  id: 'rabatt',
  label: 'Rabatt (%)',
  typ: 'zahl',
  abhaengigkeiten: [],
  steuerung: () => STEUERUNG_AN,
  validierung: (ctx) => {
    const wert = ctx.wert<number>('rabatt');
    if (wert == null) {
      return [];
    }
    return wert < 0 || wert > 100 ? ['Rabatt muss zwischen 0 und 100 liegen.'] : [];
  },
};
