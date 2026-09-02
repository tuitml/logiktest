import type { FeldModul } from '../../../core/engine';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';
import { arbDatenmanipulation } from './arb.datenmanipulation';
import { arbSteuerung } from './arb.steuerung';

/**
 * ARB (Allgemeine Rechtsschutzbedingungen) als Jahreszahl.
 * Rein abgeleitet aus dem Tarif – keine eigene Validierung, kein Wertebereich.
 */
export const arbFeld: FeldModul<number, VertragsdatenKontext> = {
  id: 'arb',
  label: 'ARB',
  typ: 'zahl',
  abhaengigkeiten: ['tarif'],
  steuerung: arbSteuerung,
  datenmanipulation: arbDatenmanipulation,
};
