import { STEUERUNG_AN } from '../../../core/engine';
import type { FeldModul } from '../../../core/engine';
import type { DeckungKontext } from '../deckung.kontext';

/** Zuschlag in Prozent (optional). */
export const zuschlagFeld: FeldModul<number, DeckungKontext> = {
  id: 'zuschlag',
  label: 'Zuschlag (%)',
  typ: 'zahl',
  abhaengigkeiten: [],
  steuerung: () => STEUERUNG_AN,
  validierung: (ctx) => {
    const wert = ctx.wert<number>('zuschlag');
    if (wert == null) {
      return [];
    }
    return wert < 0 || wert > 100 ? ['Zuschlag muss zwischen 0 und 100 liegen.'] : [];
  },
};
